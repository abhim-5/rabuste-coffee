-- 1. Find the workshop ID for 'demo11' (case insensitive search)
DO $$
DECLARE
    v_workshop_id uuid;
    v_count integer;
BEGIN
    SELECT id INTO v_workshop_id FROM workshops WHERE title ILIKE '%demo11%' LIMIT 1;
    
    IF v_workshop_id IS NULL THEN
        RAISE NOTICE 'Workshop demo11 not found!';
    ELSE
        RAISE NOTICE 'Found Workshop ID: %', v_workshop_id;
        
        -- 2. Count reviews for this workshop
        SELECT count(*) INTO v_count FROM workshop_reviews WHERE workshop_id = v_workshop_id;
        RAISE NOTICE 'Review Count for demo11: %', v_count;
        
        -- 3. List the reviews if any
        IF v_count > 0 THEN
             RAISE NOTICE 'Reviews found. Listing ids...';
        ELSE
             RAISE NOTICE 'No reviews found for this workshop.';
        END IF;
    END IF;
END $$;
