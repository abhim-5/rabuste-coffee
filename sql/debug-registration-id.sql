-- Check what registration IDs actually exist for this user
SELECT 
    id as registration_id,
    workshop_id,
    booking_number,
    status,
    payment_status,
    razorpay_order_id,
    created_at
FROM workshop_registrations
WHERE user_id = '67fedcfc-fc01-4006-aaa5-00a9f39fb77f'
ORDER BY created_at DESC
LIMIT 10;

-- Check if the specific registration ID exists
SELECT * FROM workshop_registrations 
WHERE id = '676a674a-3032-4983-9e8f-e2e70c45cd66';
