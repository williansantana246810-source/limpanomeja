const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
if (!initializeApp.apps?.length) { initializeApp({ credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)) }); }
const db = getFirestore();
exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
    try {
        const body = JSON.parse(event.body);
        if (body.action === 'payment.updated' && body.data?.id) {
            const ref = body.external_reference || '';
            if (ref.startsWith('LIMPA-')) { await db.collection('pagamentos').doc(ref).set({ status: 'confirmado', paymentId: body.data.id, timestamp: new Date().toISOString() }); }
        }
        return { statusCode: 200, body: 'OK' };
    } catch(e) { return { statusCode: 500, body: 'Erro' }; }
};
