-- SEQUENCE: public.conversations_uid_seq

-- DROP SEQUENCE IF EXISTS public.conversations_uid_seq;

CREATE SEQUENCE IF NOT EXISTS public.conversations_uid_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1

-- Table: public.conversations

-- DROP TABLE IF EXISTS public.conversations;

CREATE TABLE IF NOT EXISTS public.conversations
(
    uid integer NOT NULL DEFAULT nextval('conversations_uid_seq'::regclass),
    sender_name character varying COLLATE pg_catalog."default" NOT NULL,
    sender_id integer NOT NULL,
    receiver_name character varying COLLATE pg_catalog."default" NOT NULL,
    receiver_id integer NOT NULL,
    message character varying COLLATE pg_catalog."default",
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    room character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT conversations_pkey PRIMARY KEY (uid)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.conversations
    OWNER to postgres;