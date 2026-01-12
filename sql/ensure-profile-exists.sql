DO $$
DECLARE
    v_user_id uuid;
    v_profile_exists boolean;
BEGIN
    -- Get the user ID used in the previous insert (or just the first user)
    SELECT id INTO v_user_id FROM auth.users LIMIT 1;

    -- Check if this user exists in public.profiles
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE id = v_user_id) INTO v_profile_exists;

    IF v_profile_exists THEN
        RAISE NOTICE 'User % has a profile.', v_user_id;
    ELSE
        RAISE NOTICE 'User % does NOT have a profile. Creating one...', v_user_id;
        
        INSERT INTO public.profiles (id, full_name, email, role)
        SELECT id, email, email, 'customer'
        FROM auth.users
        WHERE id = v_user_id;
        
        RAISE NOTICE 'Profile created for user %', v_user_id;
    END IF;
END $$;
