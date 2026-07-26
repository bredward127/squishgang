import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch leads from Firestore
    const leadsSnapshot = await db.collection('leads').orderBy('createdAt', 'desc').get();
    const leads = leadsSnapshot.docs.map(doc => {
      const data = doc.data();
      return [
        data.name || '',
        data.email || '',
        data.phone || '',
        data.source || '',
        data.createdAt ? data.createdAt.toDate().toISOString() : ''
      ];
    });

    // Create a new spreadsheet
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authHeader.replace('Bearer ', '')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: { title: `Squishy World Leads - ${new Date().toLocaleDateString()}` },
        sheets: [{ properties: { title: 'Leads' } }]
      })
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      console.error('Failed to create sheet:', errorText);
      return NextResponse.json({ error: 'Failed to create Google Sheet' }, { status: 500 });
    }

    const createData = await createRes.json();
    const spreadsheetId = createData.spreadsheetId;

    // Append data
    const values = [['Name', 'Email', 'Phone', 'Source', 'Date'], ...leads];
    const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Leads!A1:E:append?valueInputOption=USER_ENTERED`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authHeader.replace('Bearer ', '')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    });

    if (!updateRes.ok) {
      console.error('Failed to update sheet:', await updateRes.text());
      return NextResponse.json({ error: 'Failed to write to Google Sheet' }, { status: 500 });
    }

    return NextResponse.json({ success: true, spreadsheetUrl: createData.spreadsheetUrl });
  } catch (error) {
    console.error('Error syncing to sheets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
