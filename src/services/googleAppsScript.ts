export const GOOGLE_APPS_SCRIPT_CODE = `
// ==========================================
// GOOGLE APPS SCRIPT BACKEND CODE
// Deploy this as a Web App to use with the Frontend
// ==========================================

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const data = JSON.parse(e.postData.contents);
    const type = data.type; // 'create_task', 'update_task', 'delete_task', 'get_data'
    const payload = data.payload;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // Ensure sheets exist
    setupSheets(ss);

    let result = {};

    if (type === 'create_task') {
      const sheet = ss.getSheetByName('daily_tasks');
      sheet.appendRow([
        payload.id,
        payload.month,
        payload.week,
        payload.day,
        payload.task,
        payload.is_completed,
        payload.status,
        payload.notes,
        new Date().toISOString()
      ]);
      result = { status: 'success', id: payload.id };
    } 
    
    else if (type === 'update_task') {
      const sheet = ss.getSheetByName('daily_tasks');
      const rows = sheet.getDataRange().getValues();
      // Assume column 0 is ID
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] == payload.id) {
          // Update columns. Adjust indices as needed.
          // Structure: id, month, week, day, task, is_completed, status, notes, created_at
          sheet.getRange(i + 1, 5).setValue(payload.task);
          sheet.getRange(i + 1, 6).setValue(payload.is_completed);
          sheet.getRange(i + 1, 7).setValue(payload.status);
          sheet.getRange(i + 1, 8).setValue(payload.notes);
          break;
        }
      }
      result = { status: 'success' };
    }

    else if (type === 'delete_task') {
      const sheet = ss.getSheetByName('daily_tasks');
      const rows = sheet.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) {
        if (rows[i][0] == payload.id) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      result = { status: 'success' };
    }

    else if (type === 'get_tasks') {
       const sheet = ss.getSheetByName('daily_tasks');
       const rows = sheet.getDataRange().getValues();
       const headers = rows[0];
       const tasks = rows.slice(1).map(row => ({
         id: row[0],
         month: row[1],
         week: row[2],
         day: row[3],
         task: row[4],
         is_completed: row[5],
         status: row[6],
         notes: row[7],
         created_at: row[8]
       }));
       result = { tasks: tasks };
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (e) {
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function setupSheets(ss) {
  const sheets = ['daily_tasks', 'weekly_goals', 'monthly_goals'];
  const headers = {
    'daily_tasks': ['id', 'month', 'week', 'day', 'task', 'is_completed', 'status', 'notes', 'created_at'],
    'weekly_goals': ['id', 'month', 'week', 'goal', 'created_at'],
    'monthly_goals': ['id', 'month', 'goal', 'created_at']
  };

  sheets.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
      sheet.appendRow(headers[name]);
    }
  });
}
`;