export const APPS_SCRIPT_CODE = `/**
 * Google Apps Script - Mobile Debt Tracker Backend
 * 
 * Paste this script into your Google Sheet's Extensions > Apps Script editor.
 * Deploy as a Web App: 
 * 1. Click "Deploy" > "New deployment"
 * 2. Select "Web app" as the type
 * 3. Set "Execute as" to "Me"
 * 4. Set "Who has access" to "Anyone"
 * 5. Click "Deploy" and authorize the permissions, then copy the Web App URL.
 */

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Transactions");
  if (!sheet) {
    sheet = ss.insertSheet("Transactions");
    // Append headers if sheet was just created
    sheet.appendRow(["ID", "Name", "Amount", "Note", "Type", "CreatedAt"]);
    // Freeze headers
    sheet.getRange("A1:F1").setFontWeight("bold");
    sheet.getRange("A1:F1").setBackground("#f1f5f9");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function processOptions() {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT);
}

function doGet(e) {
  try {
    var action = e.parameter.action;
    var sheet = getSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var rows = data.slice(1);
    
    // Map sheet rows to transaction objects
    var transactions = rows.map(function(r) {
      return {
        id: String(r[0]),
        name: String(r[1]),
        amount: Number(r[2]),
        note: String(r[3] || ""),
        type: String(r[4]),
        createdAt: String(r[5])
      };
    }).filter(function(t) { return t.id; }); // filter out empty rows
    
    if (action === "getDebts") {
      // Calculate outstanding balance grouped by Name
      var debtorMap = {};
      transactions.forEach(function(t) {
        var name = t.name.trim();
        if (!name) return;
        
        if (!debtorMap[name]) {
          debtorMap[name] = {
            name: name,
            borrows: 0,
            payments: 0,
            lastUpdated: t.createdAt
          };
        }
        
        if (t.type === "BORROW") {
          debtorMap[name].borrows += t.amount;
        } else if (t.type === "PAYMENT") {
          debtorMap[name].payments += t.amount;
        }
        
        // Track latest transaction date
        if (new Date(t.createdAt) > new Date(debtorMap[name].lastUpdated)) {
          debtorMap[name].lastUpdated = t.createdAt;
        }
      });
      
      var debts = Object.keys(debtorMap).map(function(k) {
        var d = debtorMap[k];
        var balance = Number((d.borrows - d.payments).toFixed(2));
        return {
          name: d.name,
          balance: balance,
          lastUpdated: d.lastUpdated,
          status: balance > 0 ? "UNPAID" : "PAID"
        };
      });
      
      return jsonResponse(debts);
    }
    
    if (action === "getNames") {
      // Get unique names of people in case-insensitive unique list
      var nameMap = {};
      transactions.forEach(function(t) {
        if (t.name && t.name.trim()) {
          var trimmed = t.name.trim();
          nameMap[trimmed] = true;
        }
      });
      var uniqueNames = Object.keys(nameMap);
      return jsonResponse(uniqueNames);
    }
    
    if (action === "getHistory") {
      var targetName = e.parameter.name;
      if (!targetName) {
        return jsonResponse({ error: "Missing 'name' parameter" }, 400);
      }
      
      var history = transactions
        .filter(function(t) {
          return t.name.trim().toLowerCase() === targetName.trim().toLowerCase();
        })
        .map(function(t) {
          return {
            id: t.id,
            note: t.note,
            type: t.type,
            amount: t.amount,
            createdAt: t.createdAt
          };
        });
      
      // Sort history chronologically
      history.sort(function(a, b) {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
      
      return jsonResponse(history);
    }
    
    // Default action to return all raw transactions
    return jsonResponse(transactions);
    
  } catch (err) {
    return jsonResponse({ error: err.toString() }, 500);
  }
}

function doPost(e) {
  try {
    var rawBody = e.postData.contents;
    var params = JSON.parse(rawBody);
    var action = params.action || e.parameter.action;
    
    if (!action) {
      return jsonResponse({ error: "Missing 'action' parameter" }, 400);
    }
    
    var sheet = getSheet();
    var now = new Date().toISOString();
    
    if (action === "addDebt" || action === "addPayment") {
      var type = action === "addDebt" ? "BORROW" : "PAYMENT";
      var name = params.name;
      var amount = Number(params.amount);
      var note = params.note || "";

      if (!name || isNaN(amount) || amount <= 0) {
        return jsonResponse({ error: "Invalid name or positive amount required" }, 400);
      }

      var id = Utilities.getUuid();
      sheet.appendRow([id, name.trim(), amount, note, type, now]);

      return jsonResponse({
        success: true,
        transaction: { id: id, name: name.trim(), amount: amount, note: note, type: type, createdAt: now }
      });
    }
    
    if (action === "editTransaction") {
      var id = params.id;
      var name = params.name;
      var amount = Number(params.amount);
      var note = params.note || "";
      var type = params.type; // BORROW or PAYMENT

      if (!id || !name || isNaN(amount) || amount <= 0 || (type !== "BORROW" && type !== "PAYMENT")) {
        return jsonResponse({ error: "Missing or invalid parameters for editing" }, 400);
      }

      var data = sheet.getDataRange().getValues();
      var foundRowIndex = -1;

      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === id) {
          foundRowIndex = i + 1; // 1-based index for sheets
          break;
        }
      }

      if (foundRowIndex === -1) {
        return jsonResponse({ error: "Transaction not found" }, 404);
      }

      // Update cells: Name(2), Amount(3), Note(4), Type(5)
      sheet.getRange(foundRowIndex, 2).setValue(name.trim());
      sheet.getRange(foundRowIndex, 3).setValue(amount);
      sheet.getRange(foundRowIndex, 4).setValue(note);
      sheet.getRange(foundRowIndex, 5).setValue(type);

      return jsonResponse({ success: true });
    }
    
    if (action === "deleteTransaction") {
      var id = params.id;
      if (!id) {
        return jsonResponse({ error: "Missing 'id' parameter" }, 400);
      }
      
      var data = sheet.getDataRange().getValues();
      var foundRowIndex = -1;
      
      for (var i = 1; i < data.length; i++) {
        if (String(data[i][0]) === id) {
          foundRowIndex = i + 1; // 1-based index
          break;
        }
      }
      
      if (foundRowIndex === -1) {
        return jsonResponse({ error: "Transaction not found" }, 404);
      }
      
      sheet.deleteRow(foundRowIndex);
      return jsonResponse({ success: true });
    }
    
    return jsonResponse({ error: "Action not supported in POST" }, 400);
    
  } catch (err) {
    return jsonResponse({ error: err.toString() }, 500);
  }
}

function jsonResponse(data, status) {
  var jsonString = JSON.stringify(data);
  return ContentService.createTextOutput(jsonString)
    .setMimeType(ContentService.MimeType.JSON);
}
`;
