PGDMP      ;                |            ScheduleIT-DB    17.2    17.2 K               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false                       1262    16428    ScheduleIT-DB    DATABASE     �   CREATE DATABASE "ScheduleIT-DB" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Croatian_Croatia.1250';
    DROP DATABASE "ScheduleIT-DB";
                     postgres    false            �            1259    16699    chat    TABLE     �   CREATE TABLE public.chat (
    id integer NOT NULL,
    posiljatelj_id integer NOT NULL,
    primatelj_id integer NOT NULL,
    poruka text NOT NULL,
    vrijeme timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);
    DROP TABLE public.chat;
       public         heap r       postgres    false            �            1259    16698    chat_id_seq    SEQUENCE     �   CREATE SEQUENCE public.chat_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 "   DROP SEQUENCE public.chat_id_seq;
       public               postgres    false    232                       0    0    chat_id_seq    SEQUENCE OWNED BY     ;   ALTER SEQUENCE public.chat_id_seq OWNED BY public.chat.id;
          public               postgres    false    231            �            1259    16630    grupe    TABLE     �   CREATE TABLE public.grupe (
    id integer NOT NULL,
    naziv character varying(50) NOT NULL,
    predmet_id integer NOT NULL
);
    DROP TABLE public.grupe;
       public         heap r       postgres    false            �            1259    16629    grupe_id_seq    SEQUENCE     �   CREATE SEQUENCE public.grupe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.grupe_id_seq;
       public               postgres    false    224                       0    0    grupe_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.grupe_id_seq OWNED BY public.grupe.id;
          public               postgres    false    223            �            1259    16680 	   izostanci    TABLE     �   CREATE TABLE public.izostanci (
    id integer NOT NULL,
    student_id integer NOT NULL,
    predmet_id integer NOT NULL,
    datum date NOT NULL,
    razlog text
);
    DROP TABLE public.izostanci;
       public         heap r       postgres    false            �            1259    16679    izostanci_id_seq    SEQUENCE     �   CREATE SEQUENCE public.izostanci_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.izostanci_id_seq;
       public               postgres    false    230                       0    0    izostanci_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.izostanci_id_seq OWNED BY public.izostanci.id;
          public               postgres    false    229            �            1259    16613    predmeti    TABLE     �   CREATE TABLE public.predmeti (
    id integer NOT NULL,
    naziv character varying(150) NOT NULL,
    studij_id integer NOT NULL,
    profesor_id integer NOT NULL
);
    DROP TABLE public.predmeti;
       public         heap r       postgres    false            �            1259    16612    predmeti_id_seq    SEQUENCE     �   CREATE SEQUENCE public.predmeti_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.predmeti_id_seq;
       public               postgres    false    222                       0    0    predmeti_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.predmeti_id_seq OWNED BY public.predmeti.id;
          public               postgres    false    221            �            1259    16595 	   profesori    TABLE     �   CREATE TABLE public.profesori (
    id integer NOT NULL,
    ime character varying(100) NOT NULL,
    prezime character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    lozinka character varying(255) NOT NULL
);
    DROP TABLE public.profesori;
       public         heap r       postgres    false            �            1259    16594    profesori_id_seq    SEQUENCE     �   CREATE SEQUENCE public.profesori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.profesori_id_seq;
       public               postgres    false    218                       0    0    profesori_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.profesori_id_seq OWNED BY public.profesori.id;
          public               postgres    false    217            �            1259    16663    raspored    TABLE        CREATE TABLE public.raspored (
    id integer NOT NULL,
    predmet_id integer NOT NULL,
    grupa_id integer,
    pocetak timestamp without time zone NOT NULL,
    kraj timestamp without time zone NOT NULL,
    lokacija character varying(100) NOT NULL
);
    DROP TABLE public.raspored;
       public         heap r       postgres    false            �            1259    16662    raspored_id_seq    SEQUENCE     �   CREATE SEQUENCE public.raspored_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.raspored_id_seq;
       public               postgres    false    228                       0    0    raspored_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.raspored_id_seq OWNED BY public.raspored.id;
          public               postgres    false    227            �            1259    16642    studenti    TABLE       CREATE TABLE public.studenti (
    id integer NOT NULL,
    ime character varying(100) NOT NULL,
    prezime character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    lozinka character varying(255) NOT NULL,
    studij_id integer NOT NULL,
    grupa_id integer
);
    DROP TABLE public.studenti;
       public         heap r       postgres    false            �            1259    16641    studenti_id_seq    SEQUENCE     �   CREATE SEQUENCE public.studenti_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 &   DROP SEQUENCE public.studenti_id_seq;
       public               postgres    false    226                       0    0    studenti_id_seq    SEQUENCE OWNED BY     C   ALTER SEQUENCE public.studenti_id_seq OWNED BY public.studenti.id;
          public               postgres    false    225            �            1259    16606    studiji    TABLE     d   CREATE TABLE public.studiji (
    id integer NOT NULL,
    naziv character varying(150) NOT NULL
);
    DROP TABLE public.studiji;
       public         heap r       postgres    false            �            1259    16605    studiji_id_seq    SEQUENCE     �   CREATE SEQUENCE public.studiji_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.studiji_id_seq;
       public               postgres    false    220                       0    0    studiji_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.studiji_id_seq OWNED BY public.studiji.id;
          public               postgres    false    219            K           2604    16702    chat id    DEFAULT     b   ALTER TABLE ONLY public.chat ALTER COLUMN id SET DEFAULT nextval('public.chat_id_seq'::regclass);
 6   ALTER TABLE public.chat ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    232    231    232            G           2604    16633    grupe id    DEFAULT     d   ALTER TABLE ONLY public.grupe ALTER COLUMN id SET DEFAULT nextval('public.grupe_id_seq'::regclass);
 7   ALTER TABLE public.grupe ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    223    224            J           2604    16683    izostanci id    DEFAULT     l   ALTER TABLE ONLY public.izostanci ALTER COLUMN id SET DEFAULT nextval('public.izostanci_id_seq'::regclass);
 ;   ALTER TABLE public.izostanci ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    230    230            F           2604    16616    predmeti id    DEFAULT     j   ALTER TABLE ONLY public.predmeti ALTER COLUMN id SET DEFAULT nextval('public.predmeti_id_seq'::regclass);
 :   ALTER TABLE public.predmeti ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    222    222            D           2604    16598    profesori id    DEFAULT     l   ALTER TABLE ONLY public.profesori ALTER COLUMN id SET DEFAULT nextval('public.profesori_id_seq'::regclass);
 ;   ALTER TABLE public.profesori ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    217    218    218            I           2604    16666    raspored id    DEFAULT     j   ALTER TABLE ONLY public.raspored ALTER COLUMN id SET DEFAULT nextval('public.raspored_id_seq'::regclass);
 :   ALTER TABLE public.raspored ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    227    228    228            H           2604    16645    studenti id    DEFAULT     j   ALTER TABLE ONLY public.studenti ALTER COLUMN id SET DEFAULT nextval('public.studenti_id_seq'::regclass);
 :   ALTER TABLE public.studenti ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    225    226    226            E           2604    16609 
   studiji id    DEFAULT     h   ALTER TABLE ONLY public.studiji ALTER COLUMN id SET DEFAULT nextval('public.studiji_id_seq'::regclass);
 9   ALTER TABLE public.studiji ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    220    219    220                      0    16699    chat 
   TABLE DATA           Q   COPY public.chat (id, posiljatelj_id, primatelj_id, poruka, vrijeme) FROM stdin;
    public               postgres    false    232   |U                 0    16630    grupe 
   TABLE DATA           6   COPY public.grupe (id, naziv, predmet_id) FROM stdin;
    public               postgres    false    224   �U                 0    16680 	   izostanci 
   TABLE DATA           N   COPY public.izostanci (id, student_id, predmet_id, datum, razlog) FROM stdin;
    public               postgres    false    230   �U                 0    16613    predmeti 
   TABLE DATA           E   COPY public.predmeti (id, naziv, studij_id, profesor_id) FROM stdin;
    public               postgres    false    222   �U                  0    16595 	   profesori 
   TABLE DATA           E   COPY public.profesori (id, ime, prezime, email, lozinka) FROM stdin;
    public               postgres    false    218   �U       
          0    16663    raspored 
   TABLE DATA           U   COPY public.raspored (id, predmet_id, grupa_id, pocetak, kraj, lokacija) FROM stdin;
    public               postgres    false    228   V                 0    16642    studenti 
   TABLE DATA           Y   COPY public.studenti (id, ime, prezime, email, lozinka, studij_id, grupa_id) FROM stdin;
    public               postgres    false    226   *V                 0    16606    studiji 
   TABLE DATA           ,   COPY public.studiji (id, naziv) FROM stdin;
    public               postgres    false    220   GV                  0    0    chat_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.chat_id_seq', 1, false);
          public               postgres    false    231                       0    0    grupe_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.grupe_id_seq', 1, false);
          public               postgres    false    223                       0    0    izostanci_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.izostanci_id_seq', 1, false);
          public               postgres    false    229                        0    0    predmeti_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.predmeti_id_seq', 1, false);
          public               postgres    false    221            !           0    0    profesori_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.profesori_id_seq', 1, false);
          public               postgres    false    217            "           0    0    raspored_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.raspored_id_seq', 1, false);
          public               postgres    false    227            #           0    0    studenti_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.studenti_id_seq', 1, false);
          public               postgres    false    225            $           0    0    studiji_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public.studiji_id_seq', 1, false);
          public               postgres    false    219            b           2606    16707    chat chat_pkey 
   CONSTRAINT     L   ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (id);
 8   ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_pkey;
       public                 postgres    false    232            V           2606    16635    grupe grupe_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.grupe
    ADD CONSTRAINT grupe_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.grupe DROP CONSTRAINT grupe_pkey;
       public                 postgres    false    224            `           2606    16687    izostanci izostanci_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.izostanci
    ADD CONSTRAINT izostanci_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.izostanci DROP CONSTRAINT izostanci_pkey;
       public                 postgres    false    230            T           2606    16618    predmeti predmeti_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.predmeti
    ADD CONSTRAINT predmeti_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.predmeti DROP CONSTRAINT predmeti_pkey;
       public                 postgres    false    222            N           2606    16604    profesori profesori_email_key 
   CONSTRAINT     Y   ALTER TABLE ONLY public.profesori
    ADD CONSTRAINT profesori_email_key UNIQUE (email);
 G   ALTER TABLE ONLY public.profesori DROP CONSTRAINT profesori_email_key;
       public                 postgres    false    218            P           2606    16602    profesori profesori_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.profesori
    ADD CONSTRAINT profesori_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.profesori DROP CONSTRAINT profesori_pkey;
       public                 postgres    false    218            ]           2606    16668    raspored raspored_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.raspored
    ADD CONSTRAINT raspored_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.raspored DROP CONSTRAINT raspored_pkey;
       public                 postgres    false    228            X           2606    16651    studenti studenti_email_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.studenti
    ADD CONSTRAINT studenti_email_key UNIQUE (email);
 E   ALTER TABLE ONLY public.studenti DROP CONSTRAINT studenti_email_key;
       public                 postgres    false    226            Z           2606    16649    studenti studenti_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.studenti
    ADD CONSTRAINT studenti_pkey PRIMARY KEY (id);
 @   ALTER TABLE ONLY public.studenti DROP CONSTRAINT studenti_pkey;
       public                 postgres    false    226            R           2606    16611    studiji studiji_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public.studiji
    ADD CONSTRAINT studiji_pkey PRIMARY KEY (id);
 >   ALTER TABLE ONLY public.studiji DROP CONSTRAINT studiji_pkey;
       public                 postgres    false    220            c           1259    16710    idx_chat_posiljatelj    INDEX     O   CREATE INDEX idx_chat_posiljatelj ON public.chat USING btree (posiljatelj_id);
 (   DROP INDEX public.idx_chat_posiljatelj;
       public                 postgres    false    232            d           1259    16711    idx_chat_primatelj    INDEX     K   CREATE INDEX idx_chat_primatelj ON public.chat USING btree (primatelj_id);
 &   DROP INDEX public.idx_chat_primatelj;
       public                 postgres    false    232            ^           1259    16709    idx_izostanci_student    INDEX     Q   CREATE INDEX idx_izostanci_student ON public.izostanci USING btree (student_id);
 )   DROP INDEX public.idx_izostanci_student;
       public                 postgres    false    230            [           1259    16708    idx_raspored_predmet    INDEX     O   CREATE INDEX idx_raspored_predmet ON public.raspored USING btree (predmet_id);
 (   DROP INDEX public.idx_raspored_predmet;
       public                 postgres    false    228            g           2606    16636    grupe grupe_predmet_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.grupe
    ADD CONSTRAINT grupe_predmet_id_fkey FOREIGN KEY (predmet_id) REFERENCES public.predmeti(id);
 E   ALTER TABLE ONLY public.grupe DROP CONSTRAINT grupe_predmet_id_fkey;
       public               postgres    false    222    4692    224            l           2606    16693 #   izostanci izostanci_predmet_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.izostanci
    ADD CONSTRAINT izostanci_predmet_id_fkey FOREIGN KEY (predmet_id) REFERENCES public.predmeti(id);
 M   ALTER TABLE ONLY public.izostanci DROP CONSTRAINT izostanci_predmet_id_fkey;
       public               postgres    false    230    222    4692            m           2606    16688 #   izostanci izostanci_student_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.izostanci
    ADD CONSTRAINT izostanci_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.studenti(id);
 M   ALTER TABLE ONLY public.izostanci DROP CONSTRAINT izostanci_student_id_fkey;
       public               postgres    false    226    4698    230            e           2606    16624 "   predmeti predmeti_profesor_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.predmeti
    ADD CONSTRAINT predmeti_profesor_id_fkey FOREIGN KEY (profesor_id) REFERENCES public.profesori(id);
 L   ALTER TABLE ONLY public.predmeti DROP CONSTRAINT predmeti_profesor_id_fkey;
       public               postgres    false    218    4688    222            f           2606    16619     predmeti predmeti_studij_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.predmeti
    ADD CONSTRAINT predmeti_studij_id_fkey FOREIGN KEY (studij_id) REFERENCES public.studiji(id);
 J   ALTER TABLE ONLY public.predmeti DROP CONSTRAINT predmeti_studij_id_fkey;
       public               postgres    false    222    4690    220            j           2606    16674    raspored raspored_grupa_id_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.raspored
    ADD CONSTRAINT raspored_grupa_id_fkey FOREIGN KEY (grupa_id) REFERENCES public.grupe(id);
 I   ALTER TABLE ONLY public.raspored DROP CONSTRAINT raspored_grupa_id_fkey;
       public               postgres    false    4694    224    228            k           2606    16669 !   raspored raspored_predmet_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.raspored
    ADD CONSTRAINT raspored_predmet_id_fkey FOREIGN KEY (predmet_id) REFERENCES public.predmeti(id);
 K   ALTER TABLE ONLY public.raspored DROP CONSTRAINT raspored_predmet_id_fkey;
       public               postgres    false    222    228    4692            h           2606    16657    studenti studenti_grupa_id_fkey    FK CONSTRAINT        ALTER TABLE ONLY public.studenti
    ADD CONSTRAINT studenti_grupa_id_fkey FOREIGN KEY (grupa_id) REFERENCES public.grupe(id);
 I   ALTER TABLE ONLY public.studenti DROP CONSTRAINT studenti_grupa_id_fkey;
       public               postgres    false    224    4694    226            i           2606    16652     studenti studenti_studij_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.studenti
    ADD CONSTRAINT studenti_studij_id_fkey FOREIGN KEY (studij_id) REFERENCES public.studiji(id);
 J   ALTER TABLE ONLY public.studenti DROP CONSTRAINT studenti_studij_id_fkey;
       public               postgres    false    226    220    4690                  x������ � �            x������ � �            x������ � �            x������ � �             x������ � �      
      x������ � �            x������ � �            x������ � �     