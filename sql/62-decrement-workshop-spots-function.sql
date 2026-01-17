-- Helper function to decrement workshop available spots
CREATE OR REPLACE FUNCTION decrement_workshop_spots(workshop_uuid uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE workshops
  SET available_spots = GREATEST(available_spots - 1, 0)
  WHERE id = workshop_uuid;
END;
$$;
