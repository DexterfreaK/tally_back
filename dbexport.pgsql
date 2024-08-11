--
-- PostgreSQL database dump
--

-- Dumped from database version 15.8 (Homebrew)
-- Dumped by pg_dump version 15.8 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: contest_problems; Type: TABLE; Schema: public; Owner: tally_usr
--

CREATE TABLE public.contest_problems (
    contest_id integer NOT NULL,
    problem_id integer NOT NULL
);


ALTER TABLE public.contest_problems OWNER TO tally_usr;

--
-- Name: contests; Type: TABLE; Schema: public; Owner: tally_usr
--

CREATE TABLE public.contests (
    contest_id integer NOT NULL,
    created_by_user_id integer,
    contest_name character varying(255) NOT NULL,
    description text,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    leaderboard_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_dates CHECK ((start_date < end_date))
);


ALTER TABLE public.contests OWNER TO tally_usr;

--
-- Name: contests_contest_id_seq; Type: SEQUENCE; Schema: public; Owner: tally_usr
--

CREATE SEQUENCE public.contests_contest_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.contests_contest_id_seq OWNER TO tally_usr;

--
-- Name: contests_contest_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tally_usr
--

ALTER SEQUENCE public.contests_contest_id_seq OWNED BY public.contests.contest_id;


--
-- Name: examples; Type: TABLE; Schema: public; Owner: tally_usr
--

CREATE TABLE public.examples (
    id integer NOT NULL,
    problem_id integer,
    example text NOT NULL
);


ALTER TABLE public.examples OWNER TO tally_usr;

--
-- Name: examples_id_seq; Type: SEQUENCE; Schema: public; Owner: tally_usr
--

CREATE SEQUENCE public.examples_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.examples_id_seq OWNER TO tally_usr;

--
-- Name: examples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tally_usr
--

ALTER SEQUENCE public.examples_id_seq OWNED BY public.examples.id;


--
-- Name: problems; Type: TABLE; Schema: public; Owner: tally_usr
--

CREATE TABLE public.problems (
    id integer NOT NULL,
    problem_name character varying(255) NOT NULL,
    description text NOT NULL,
    constraints text
);


ALTER TABLE public.problems OWNER TO tally_usr;

--
-- Name: problems_id_seq; Type: SEQUENCE; Schema: public; Owner: tally_usr
--

CREATE SEQUENCE public.problems_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.problems_id_seq OWNER TO tally_usr;

--
-- Name: problems_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tally_usr
--

ALTER SEQUENCE public.problems_id_seq OWNED BY public.problems.id;


--
-- Name: submissions; Type: TABLE; Schema: public; Owner: tally_usr
--

CREATE TABLE public.submissions (
    id integer NOT NULL,
    problem_id integer,
    user_id integer,
    contest_id integer,
    code text NOT NULL,
    attempted boolean DEFAULT true NOT NULL,
    is_correct boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_contest_submission boolean DEFAULT false NOT NULL,
    language character varying(50) NOT NULL
);


ALTER TABLE public.submissions OWNER TO tally_usr;

--
-- Name: submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: tally_usr
--

CREATE SEQUENCE public.submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.submissions_id_seq OWNER TO tally_usr;

--
-- Name: submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tally_usr
--

ALTER SEQUENCE public.submissions_id_seq OWNED BY public.submissions.id;


--
-- Name: test_case_results; Type: TABLE; Schema: public; Owner: tally_usr
--

CREATE TABLE public.test_case_results (
    id integer NOT NULL,
    submission_id integer,
    test_case_id integer,
    actual_output text NOT NULL,
    execution_time double precision NOT NULL,
    memory_usage integer NOT NULL,
    passed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.test_case_results OWNER TO tally_usr;

--
-- Name: test_case_results_id_seq; Type: SEQUENCE; Schema: public; Owner: tally_usr
--

CREATE SEQUENCE public.test_case_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_case_results_id_seq OWNER TO tally_usr;

--
-- Name: test_case_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tally_usr
--

ALTER SEQUENCE public.test_case_results_id_seq OWNED BY public.test_case_results.id;


--
-- Name: test_cases; Type: TABLE; Schema: public; Owner: tally_usr
--

CREATE TABLE public.test_cases (
    id integer NOT NULL,
    problem_id integer,
    input text NOT NULL,
    output text NOT NULL
);


ALTER TABLE public.test_cases OWNER TO tally_usr;

--
-- Name: test_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: tally_usr
--

CREATE SEQUENCE public.test_cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.test_cases_id_seq OWNER TO tally_usr;

--
-- Name: test_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tally_usr
--

ALTER SEQUENCE public.test_cases_id_seq OWNED BY public.test_cases.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: tally_usr
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    name character varying(50),
    bio text,
    profile_picture_url character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO tally_usr;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: tally_usr
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO tally_usr;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: tally_usr
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: contests contest_id; Type: DEFAULT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.contests ALTER COLUMN contest_id SET DEFAULT nextval('public.contests_contest_id_seq'::regclass);


--
-- Name: examples id; Type: DEFAULT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.examples ALTER COLUMN id SET DEFAULT nextval('public.examples_id_seq'::regclass);


--
-- Name: problems id; Type: DEFAULT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.problems ALTER COLUMN id SET DEFAULT nextval('public.problems_id_seq'::regclass);


--
-- Name: submissions id; Type: DEFAULT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.submissions ALTER COLUMN id SET DEFAULT nextval('public.submissions_id_seq'::regclass);


--
-- Name: test_case_results id; Type: DEFAULT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.test_case_results ALTER COLUMN id SET DEFAULT nextval('public.test_case_results_id_seq'::regclass);


--
-- Name: test_cases id; Type: DEFAULT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.test_cases ALTER COLUMN id SET DEFAULT nextval('public.test_cases_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: contest_problems; Type: TABLE DATA; Schema: public; Owner: tally_usr
--

COPY public.contest_problems (contest_id, problem_id) FROM stdin;
1	1
1	2
1	3
2	1
2	2
3	2
3	3
\.


--
-- Data for Name: contests; Type: TABLE DATA; Schema: public; Owner: tally_usr
--

COPY public.contests (contest_id, created_by_user_id, contest_name, description, start_date, end_date, leaderboard_id, created_at) FROM stdin;
1	1	Summer Coding Challenge	A fun and challenging coding contest to kick off the summer.	2024-08-15 10:00:00	2024-08-22 18:00:00	101	2024-08-11 04:12:19.78419
2	2	Fall Algorithm Fest	Test your algorithmic skills in this exciting fall contest!	2024-09-01 09:00:00	2024-09-15 21:00:00	102	2024-08-11 04:12:19.78419
3	3	Winter Code Sprint	Join the winter code sprint and compete against the best.	2024-12-01 12:00:00	2024-12-07 23:59:00	103	2024-08-11 04:12:19.78419
\.


--
-- Data for Name: examples; Type: TABLE DATA; Schema: public; Owner: tally_usr
--

COPY public.examples (id, problem_id, example) FROM stdin;
1	1	Example 1: Input - 1, Output - 2
2	1	Example 2: Input - 3, Output - 4
3	2	Input :-2 4\nOuput: 2
4	3	input : "7",\noutput: "5040"
5	5	input: "1 100"\noutput: "100"
\.


--
-- Data for Name: problems; Type: TABLE DATA; Schema: public; Owner: tally_usr
--

COPY public.problems (id, problem_name, description, constraints) FROM stdin;
1	Example Problem	This is an example problem.	Constraints go here.
2	Sum of Two Numbers	Given two integers, return their sum	-10^9 <= a, b <= 10^9
3	Factorial	Given an integer n, return the factorial of n.	"0 <= n <= 12
4			
5	Reverse Array	Given an array of integers, return the array in reverse order.	1 <= n <= 1000\n-10^9 <= arr[i] <= 10^9
6	Sum of Digits	Given an integer, return the sum of its digits.	0 <= n <= 10^9
7	Sum of Digits	Given an integer, return the sum of its digits.	0 <= n <= 10^9
\.


--
-- Data for Name: submissions; Type: TABLE DATA; Schema: public; Owner: tally_usr
--

COPY public.submissions (id, problem_id, user_id, contest_id, code, attempted, is_correct, created_at, is_contest_submission, language) FROM stdin;
9	3	1	\N		t	f	2024-08-11 06:33:23.842528	f	python
12	3	1	\N		t	f	2024-08-11 06:35:15.391387	f	python
13	3	1	\N	n = int(input())\nfact = 1\n\nfor i in range(1, n+1):\n    fact = fact * i\nprint(fact)\n	t	t	2024-08-11 06:35:50.021128	f	python
14	7	1	\N	def getSum(n): \n    \n    sum = 0\n    for digit in str(n):  \n      sum += int(digit)       \n    return sum\n   \nn = input()\nprint(getSum(n))	t	t	2024-08-11 07:07:17.725391	f	python
15	3	1	\N	n = int(input())\nfact = 1\n\nfor i in range(1, n+1):\n    fact = fact * i\nprint(fact)\n	t	t	2024-08-11 07:11:22.216469	f	python
16	3	1	\N	n = int(input())\nfact = 1\n\nfor i in range(1, n+1):\n    fact = fact * i\nprint(fact)\n	t	f	2024-08-11 07:11:31.553584	f	python
17	7	1	\N	def getSum(n): \n    \n    sum = 0\n    for digit in str(n):  \n      sum += int(digit)       \n    return sum\n   \nn = 12345\nprint(getSum(n))	t	f	2024-08-11 07:12:03.702789	f	python
18	7	1	\N	def getSum(n): \n    \n    sum = 0\n    for digit in str(n):  \n      sum += int(digit)       \n    return sum\n   \nn = input()\nprint(getSum(n))	t	t	2024-08-11 07:12:14.489001	f	python
\.


--
-- Data for Name: test_case_results; Type: TABLE DATA; Schema: public; Owner: tally_usr
--

COPY public.test_case_results (id, submission_id, test_case_id, actual_output, execution_time, memory_usage, passed) FROM stdin;
25	9	4		113	0	f
26	9	5		80	0	f
27	9	6		76	0	f
28	9	7		79	0	f
37	12	4		70	0	f
38	12	5		81	0	f
39	12	6		77	0	f
40	12	7		86	0	f
41	13	4	120\n	94	0	t
42	13	5	1\n	87	0	t
43	13	6	1\n	80	0	t
44	13	7	5040\n	70	0	t
45	14	11	6\n	105	0	t
46	14	12	15\n	85	0	t
47	15	4	120\n	130	0	t
48	15	5	1\n	77	0	t
49	15	6	1\n	75	0	t
50	15	7	5040\n	83	0	t
51	16	4	120\n	77	0	t
52	16	5	1\n	76	0	t
53	16	6	Traceback (most recent call last):\n  File "<string>", line 1, in <module>\nValueError: invalid literal for int() with base 10: '{"hijack":true,"stream":true,"stdin":true,"stdout":true,"stderr":true}1'\n	74	0	f
54	16	7	5040\n	76	0	t
55	17	11	15\n	82	0	f
56	17	12	15\n	69	0	t
57	18	11	6\n	71	0	t
58	18	12	15\n	81	0	t
\.


--
-- Data for Name: test_cases; Type: TABLE DATA; Schema: public; Owner: tally_usr
--

COPY public.test_cases (id, problem_id, input, output) FROM stdin;
1	1	1	2
2	1	3	4
3	2	3 5	8
4	3	5	120
5	3	0	1
6	3	1	1
7	3	7	5040
8	5	5 1 2 3 4 5	5 4 3 2 1
9	6	123	6
10	6	456	15
11	7	123	6
12	7	456	15
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: tally_usr
--

COPY public.users (user_id, username, email, name, bio, profile_picture_url, created_at) FROM stdin;
1	john_doe	john.doe@example.com	John Doe	A software developer from NY	http://example.com/profile/john_doe.jpg	2024-08-11 04:09:32.382017
2	jane_smith	jane.smith@example.com	Jane Smith	Data scientist and machine learning enthusiast	http://example.com/profile/jane_smith.jpg	2024-08-11 04:09:37.242376
3	alice_jones	alice.jones@example.com	Alice Jones	Full-stack developer with a passion for open-source	http://example.com/profile/alice_jones.jpg	2024-08-11 04:09:42.982927
4	bob_brown	bob.brown@example.com	Bob Brown	Frontend developer and tech blogger	http://example.com/profile/bob_brown.jpg	2024-08-11 04:09:42.982927
\.


--
-- Name: contests_contest_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tally_usr
--

SELECT pg_catalog.setval('public.contests_contest_id_seq', 3, true);


--
-- Name: examples_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tally_usr
--

SELECT pg_catalog.setval('public.examples_id_seq', 5, true);


--
-- Name: problems_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tally_usr
--

SELECT pg_catalog.setval('public.problems_id_seq', 7, true);


--
-- Name: submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tally_usr
--

SELECT pg_catalog.setval('public.submissions_id_seq', 18, true);


--
-- Name: test_case_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tally_usr
--

SELECT pg_catalog.setval('public.test_case_results_id_seq', 58, true);


--
-- Name: test_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tally_usr
--

SELECT pg_catalog.setval('public.test_cases_id_seq', 12, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: tally_usr
--

SELECT pg_catalog.setval('public.users_user_id_seq', 4, true);


--
-- Name: contest_problems contest_problems_pkey; Type: CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.contest_problems
    ADD CONSTRAINT contest_problems_pkey PRIMARY KEY (contest_id, problem_id);


--
-- Name: contests contests_pkey; Type: CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.contests
    ADD CONSTRAINT contests_pkey PRIMARY KEY (contest_id);


--
-- Name: examples examples_pkey; Type: CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.examples
    ADD CONSTRAINT examples_pkey PRIMARY KEY (id);


--
-- Name: problems problems_pkey; Type: CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.problems
    ADD CONSTRAINT problems_pkey PRIMARY KEY (id);


--
-- Name: submissions submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);


--
-- Name: test_case_results test_case_results_pkey; Type: CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.test_case_results
    ADD CONSTRAINT test_case_results_pkey PRIMARY KEY (id);


--
-- Name: test_cases test_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.test_cases
    ADD CONSTRAINT test_cases_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_submission_contest; Type: INDEX; Schema: public; Owner: tally_usr
--

CREATE INDEX idx_submission_contest ON public.submissions USING btree (contest_id);


--
-- Name: idx_submission_problem; Type: INDEX; Schema: public; Owner: tally_usr
--

CREATE INDEX idx_submission_problem ON public.submissions USING btree (problem_id);


--
-- Name: idx_submission_user; Type: INDEX; Schema: public; Owner: tally_usr
--

CREATE INDEX idx_submission_user ON public.submissions USING btree (user_id);


--
-- Name: idx_test_case_results_submission; Type: INDEX; Schema: public; Owner: tally_usr
--

CREATE INDEX idx_test_case_results_submission ON public.test_case_results USING btree (submission_id);


--
-- Name: idx_test_case_results_test_case; Type: INDEX; Schema: public; Owner: tally_usr
--

CREATE INDEX idx_test_case_results_test_case ON public.test_case_results USING btree (test_case_id);


--
-- Name: contest_problems contest_problems_contest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.contest_problems
    ADD CONSTRAINT contest_problems_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(contest_id);


--
-- Name: contest_problems contest_problems_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.contest_problems
    ADD CONSTRAINT contest_problems_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problems(id);


--
-- Name: contests contests_created_by_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.contests
    ADD CONSTRAINT contests_created_by_user_id_fkey FOREIGN KEY (created_by_user_id) REFERENCES public.users(user_id);


--
-- Name: examples examples_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.examples
    ADD CONSTRAINT examples_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problems(id) ON DELETE CASCADE;


--
-- Name: submissions submissions_contest_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_contest_id_fkey FOREIGN KEY (contest_id) REFERENCES public.contests(contest_id);


--
-- Name: submissions submissions_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problems(id);


--
-- Name: submissions submissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.submissions
    ADD CONSTRAINT submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: test_case_results test_case_results_submission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.test_case_results
    ADD CONSTRAINT test_case_results_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES public.submissions(id) ON DELETE CASCADE;


--
-- Name: test_case_results test_case_results_test_case_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.test_case_results
    ADD CONSTRAINT test_case_results_test_case_id_fkey FOREIGN KEY (test_case_id) REFERENCES public.test_cases(id);


--
-- Name: test_cases test_cases_problem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: tally_usr
--

ALTER TABLE ONLY public.test_cases
    ADD CONSTRAINT test_cases_problem_id_fkey FOREIGN KEY (problem_id) REFERENCES public.problems(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

