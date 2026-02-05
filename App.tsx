import React, { useState, useRef, useEffect, useMemo } from 'react';
import { geminiService } from './services/geminiService';
import { Message, DashboardData } from './types';
import { ChartRenderer } from './components/ChartRenderer';

const DEFAULT_CSV = `objectid,kategori,komponen,zon,kod_negeri,negeri,rancangan_tempatan
1,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTJ Pasir Putih
2,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTMD Ketereh
3,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTJ Tumpat
4,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,3,KELANTAN,RTJ Kuala Krai
5,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,11,TERENGGANU,RTD Besut
6,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,11,TERENGGANU,RTD Setiu
7,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,11,TERENGGANU,RTD H.Terengganu
8,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,11,TERENGGANU,RTD Marang
9,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTD Bera
10,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTD Temerloh
11,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTD Maran
12,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTD Raub
13,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTMD Lipis
14,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Timur,6,PAHANG,RTD Rompin
15,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,8,PERAK,RTD Kuala Kangsar
16,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,8,PERAK,RTMB Ipoh
17,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,8,PERAK,RTD Batang Padang
18,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,8,PERAK,RTD Mualim
19,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,8,PERAK,RTD Hilir Perak
20,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,10,SELANGOR,RTMP Klang
21,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
22,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Tengah,10,SELANGOR,RTD Sabak Bernam
23,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Utara,2,KEDAH,RTD Pendang
24,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Utara,2,KEDAH,RTD Baling
25,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Utara,2,KEDAH,RTD Padang Terap
26,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Utara,2,KEDAH,RTD Sik
27,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Utara,2,KEDAH,RTD Yan
28,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,1,JOHOR,RTD Kluang
29,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,1,JOHOR,RTD Muar
30,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,1,JOHOR,RT MBJB
31,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,1,JOHOR,RT MBIP
32,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,1,JOHOR,RTD Kota Tinggi
33,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,4,MELAKA,RTMP Alor Gajah
34,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,4,MELAKA,RT MPHTJ
35,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,4,MELAKA,RTMP Jasin
36,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
37,Skop Sektor Pengurusan Risiko Bencana,Banjir,Zon Selatan,5,NEGERI SEMBILAN,RTD Jelebu
38,Skop Sektor Pengurusan Risiko Bencana,Tsunami/Gempa Bumi,Zon Timur,3,KELANTAN,RTJ Tumpat
39,Skop Sektor Pengurusan Risiko Bencana,Tsunami/Gempa Bumi,Zon Timur,11,TERENGGANU,RTD H.Terengganu
40,Skop Sektor Pengurusan Risiko Bencana,Tsunami/Gempa Bumi,Zon Timur,6,PAHANG,RTD Maran
41,Skop Sektor Pengurusan Risiko Bencana,Tsunami/Gempa Bumi,Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
42,Skop Sektor Pengurusan Risiko Bencana,Tsunami/Gempa Bumi,Zon Tengah,10,SELANGOR,RTD Sabak Bernam
43,Skop Sektor Pengurusan Risiko Bencana,Tsunami/Gempa Bumi,Zon Utara,2,KEDAH,RTD Yan
44,Skop Sektor Pengurusan Risiko Bencana,Tsunami/Gempa Bumi,Zon Selatan,4,MELAKA,RTMP Jasin
45,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Timur,11,TERENGGANU,RTD H.Terengganu
46,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Timur,6,PAHANG,RTD Temerloh
47,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Timur,6,PAHANG,RTD Raub
48,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Timur,6,PAHANG,RTMD Lipis
49,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Tengah,8,PERAK,RTD Mualim
50,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Tengah,10,SELANGOR,RTMP Klang
51,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
52,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Utara,2,KEDAH,RTD Pendang
53,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Utara,2,KEDAH,RTD Padang Terap
54,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Utara,2,KEDAH,RTD Yan
55,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Selatan,1,JOHOR,RTD Kluang
56,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Selatan,1,JOHOR,RT MBJB
57,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Selatan,4,MELAKA,RTMP Alor Gajah
58,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Selatan,4,MELAKA,RT MPHTJ
59,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Selatan,4,MELAKA,RTMP Jasin
60,Skop Sektor Pengurusan Risiko Bencana,Tanah Runtuh,Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
61,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Timur,3,KELANTAN,RTJ Pasir Putih
62,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Timur,11,TERENGGANU,RTD Besut
63,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Timur,11,TERENGGANU,RTD Setiu
64,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Timur,11,TERENGGANU,RTD Marang
65,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Timur,6,PAHANG,RTD Rompin
66,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Tengah,10,SELANGOR,RTMP Klang
67,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
68,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Tengah,10,SELANGOR,RTD Sabak Bernam
69,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Utara,2,KEDAH,RTD Yan
70,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Selatan,1,JOHOR,RTD Muar
71,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Selatan,1,JOHOR,RT MBJB
72,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Selatan,1,JOHOR,RTD Kota Tinggi
73,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Selatan,4,MELAKA,RTMP Alor Gajah
74,Skop Sektor Pengurusan Risiko Bencana,Hakisan Pantai,Zon Selatan,4,MELAKA,RTMP Jasin
75,Skop Sektor Pengurusan Risiko Bencana,Hakisan Sungai,Zon Timur,11,TERENGGANU,RTD Setiu
76,Skop Sektor Pengurusan Risiko Bencana,Hakisan Sungai,Zon Timur,6,PAHANG,RTD Temerloh
77,Skop Sektor Pengurusan Risiko Bencana,Hakisan Sungai,Zon Timur,6,PAHANG,RTD Maran
78,Skop Sektor Pengurusan Risiko Bencana,Hakisan Sungai,Zon Tengah,8,PERAK,RTD Hilir Perak
79,Skop Sektor Pengurusan Risiko Bencana,Hakisan Sungai,Zon Selatan,1,JOHOR,RTD Kluang
80,Skop Sektor Pengurusan Risiko Bencana,Hakisan Sungai,Zon Selatan,1,JOHOR,RT MBJB
81,Skop Sektor Pengurusan Risiko Bencana,Kenaikan Aras Air Laut,Zon Tengah,10,SELANGOR,RTMP Klang
82,Skop Sektor Pengurusan Risiko Bencana,Kenaikan Aras Air Laut,Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
83,Skop Sektor Pengurusan Risiko Bencana,Kenaikan Aras Air Laut,Zon Tengah,10,SELANGOR,RTD Sabak Bernam
84,Skop Sektor Pengurusan Risiko Bencana,Kenaikan Aras Air Laut,Zon Utara,2,KEDAH,RTD Yan
85,Skop Sektor Pengurusan Risiko Bencana,Kenaikan Aras Air Laut,Zon Selatan,1,JOHOR,RTD Muar
86,Skop Sektor Pengurusan Risiko Bencana,Kenaikan Aras Air Laut,Zon Selatan,1,JOHOR,RT MBJB
87,Skop Sektor Pengurusan Risiko Bencana,Kenaikan Aras Air Laut,Zon Selatan,1,JOHOR,RTD Kota Tinggi
88,Skop Sektor Pengurusan Risiko Bencana,Kenaikan Aras Air Laut,Zon Selatan,4,MELAKA,RTMP Alor Gajah
89,Skop Sektor Pengurusan Risiko Bencana,Kenaikan Aras Air Laut,Zon Selatan,4,MELAKA,RTMP Jasin
90,Skop Sektor Pengurusan Risiko Bencana,"Tanah Mendap, Lubang Benam/Runtuhan Batu",Zon Tengah,8,PERAK,RTD Kuala Kangsar
91,Skop Sektor Pengurusan Risiko Bencana,"Tanah Mendap, Lubang Benam/Runtuhan Batu",Zon Tengah,8,PERAK,RTMB Ipoh
92,Skop Sektor Pengurusan Risiko Bencana,"Tanah Mendap, Lubang Benam/Runtuhan Batu",Zon Tengah,8,PERAK,RTD Hilir Perak
93,Skop Sektor Pengurusan Risiko Bencana,"Tanah Mendap, Lubang Benam/Runtuhan Batu",Zon Tengah,10,SELANGOR,RTD Sabak Bernam
94,Skop Sektor Pengurusan Risiko Bencana,"Tanah Mendap, Lubang Benam/Runtuhan Batu",Zon Utara,2,KEDAH,RTD Padang Terap
95,Skop Sektor Pengurusan Risiko Bencana,"Tanah Mendap, Lubang Benam/Runtuhan Batu",Zon Selatan,1,JOHOR,RTD Kluang
96,Skop Sektor Pengurusan Risiko Bencana,Kebakaran Tanah Gambut,Zon Selatan,1,JOHOR,RTD Muar
97,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,3,KELANTAN,RTMD Ketereh
98,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,3,KELANTAN,RTJ Tumpat
99,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,3,KELANTAN,RTJ Kuala Krai
100,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,11,TERENGGANU,RTD Besut
101,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,11,TERENGGANU,RTD Setiu
102,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,11,TERENGGANU,RTD H.Terengganu
103,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,11,TERENGGANU,RTD Marang
104,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,6,PAHANG,RTD Bera
105,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,6,PAHANG,RTD Temerloh
106,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,6,PAHANG,RTD Maran
107,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,6,PAHANG,RTD Raub
108,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,6,PAHANG,RTMD Lipis
109,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Timur,6,PAHANG,RTD Rompin
110,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Tengah,8,PERAK,RTD Kuala Kangsar
111,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Tengah,8,PERAK,RTD Hilir Perak
112,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Tengah,10,SELANGOR,RTMP Klang
113,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
114,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Tengah,10,SELANGOR,RTD Sabak Bernam
115,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Utara,2,KEDAH,RTD Pendang
116,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Utara,2,KEDAH,RTD Baling
117,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Utara,2,KEDAH,RTD Padang Terap
118,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Utara,2,KEDAH,RTD Sik
119,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Utara,2,KEDAH,RTD Yan
120,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Selatan,1,JOHOR,RTD Kluang
121,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Selatan,1,JOHOR,RTD Muar
122,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Selatan,1,JOHOR,RT MBJB
123,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Selatan,1,JOHOR,RT MBIP
124,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Selatan,1,JOHOR,RTD Kota Tinggi
125,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Selatan,4,MELAKA,RTMP Alor Gajah
126,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Selatan,4,MELAKA,RT MPHTJ
127,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Selatan,4,MELAKA,RTMP Jasin
128,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
129,Peta/Pelan Pengurusan Risiko Bencana,Peta Risiko Geobencana,Zon Selatan,5,NEGERI SEMBILAN,RTD Jelebu
130,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Timur,3,KELANTAN,RTMD Ketereh
131,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Timur,3,KELANTAN,RTJ Tumpat
132,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Timur,11,TERENGGANU,RTD H.Terengganu
133,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Timur,11,TERENGGANU,RTD Marang
134,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Timur,6,PAHANG,RTD Bera
135,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Timur,6,PAHANG,RTD Temerloh
136,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Timur,6,PAHANG,RTD Maran
137,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Timur,6,PAHANG,RTMD Lipis
138,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Utara,2,KEDAH,RTD Pendang
139,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Utara,2,KEDAH,RTD Baling
140,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Utara,2,KEDAH,RTD Yan
141,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Selatan,1,JOHOR,RT MBIP
142,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Selatan,4,MELAKA,RTMP Alor Gajah
143,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Selatan,4,MELAKA,RT MPHTJ
144,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Selatan,4,MELAKA,RTMP Jasin
145,Peta/Pelan Pengurusan Risiko Bencana,Peta Bahaya Geobencana,Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
146,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Timur,3,KELANTAN,RTJ Kuala Krai
147,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Timur,11,TERENGGANU,RTD H.Terengganu
148,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Timur,11,TERENGGANU,RTD Marang
149,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Timur,6,PAHANG,RTD Bera
150,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Tengah,8,PERAK,RTD Hilir Perak
151,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Tengah,10,SELANGOR,RTD Sabak Bernam
152,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Utara,2,KEDAH,RTD Pendang
153,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Utara,2,KEDAH,RTD Baling
154,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Utara,2,KEDAH,RTD Yan
155,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Selatan,1,JOHOR,RT MBJB
156,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Selatan,1,JOHOR,RT MBIP
157,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Selatan,1,JOHOR,RTD Kota Tinggi
158,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Selatan,4,MELAKA,RT MPHTJ
159,Peta/Pelan Pengurusan Risiko Bencana,Peta keterdedahan geobencana,Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
160,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Timur,11,TERENGGANU,RTD H.Terengganu
161,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Timur,11,TERENGGANU,RTD Marang
162,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Timur,6,PAHANG,RTD Bera
163,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Tengah,10,SELANGOR,RTD Sabak Bernam
164,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Utara,2,KEDAH,RTD Pendang
165,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Utara,2,KEDAH,RTD Baling
166,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Utara,2,KEDAH,RTD Yan
167,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Selatan,1,JOHOR,RT MBIP
168,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Selatan,1,JOHOR,RTD Kota Tinggi
169,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Selatan,4,MELAKA,RT MPHTJ
170,Peta/Pelan Pengurusan Risiko Bencana,Peta kerapuhan geobencana,Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
171,Peta/Pelan Pengurusan Risiko Bencana,Peta laluan evakuasi geobencana,Zon Timur,3,KELANTAN,RTMD Ketereh
172,Peta/Pelan Pengurusan Risiko Bencana,Peta laluan evakuasi geobencana,Zon Timur,3,KELANTAN,RTJ Tumpat
173,Peta/Pelan Pengurusan Risiko Bencana,Peta laluan evakuasi geobencana,Zon Timur,11,TERENGGANU,RTD H.Terengganu
174,Peta/Pelan Pengurusan Risiko Bencana,Peta laluan evakuasi geobencana,Zon Timur,11,TERENGGANU,RTD Marang
175,Peta/Pelan Pengurusan Risiko Bencana,Peta laluan evakuasi geobencana,Zon Timur,6,PAHANG,RTD Maran
176,Peta/Pelan Pengurusan Risiko Bencana,Peta laluan evakuasi geobencana,Zon Timur,6,PAHANG,RTMD Lipis
177,Peta/Pelan Pengurusan Risiko Bencana,Peta laluan evakuasi geobencana,Zon Timur,6,PAHANG,RTD Rompin
178,Peta/Pelan Pengurusan Risiko Bencana,Peta laluan evakuasi geobencana,Zon Utara,2,KEDAH,RTD Yan
179,Peta/Pelan Pengurusan Risiko Bencana,Pelan zoning pengurusan pantai,Zon Timur,3,KELANTAN,RTJ Pasir Putih
180,Peta/Pelan Pengurusan Risiko Bencana,Pelan zoning pengurusan pantai,Zon Timur,11,TERENGGANU,RTD Setiu
181,Peta/Pelan Pengurusan Risiko Bencana,Pelan zoning pengurusan pantai,Zon Timur,11,TERENGGANU,RTD Marang
182,Peta/Pelan Pengurusan Risiko Bencana,Pelan zoning pengurusan pantai,Zon Utara,2,KEDAH,RTD Yan
183,Peta/Pelan Pengurusan Risiko Bencana,Pelan zoning pengurusan pantai,Zon Selatan,4,MELAKA,RTMP Alor Gajah
184,Peta/Pelan Pengurusan Risiko Bencana,Pelan zoning pengurusan pantai,Zon Selatan,4,MELAKA,RTMP Jasin
185,Peta/Pelan Pengurusan Risiko Bencana,Lokasi Amaran Awal Banjir,Zon Timur,3,KELANTAN,RTMD Ketereh
186,Peta/Pelan Pengurusan Risiko Bencana,Lokasi Amaran Awal Banjir,Zon Timur,11,TERENGGANU,RTD Marang
187,Peta/Pelan Pengurusan Risiko Bencana,Pusat Pemindahan Sementara,Zon Timur,3,KELANTAN,RTMD Ketereh
188,Peta/Pelan Pengurusan Risiko Bencana,Pusat Pemindahan Sementara,Zon Timur,11,TERENGGANU,RTD H.Terengganu
189,Peta/Pelan Pengurusan Risiko Bencana,Pusat Pemindahan Sementara,Zon Timur,6,PAHANG,RTMD Lipis
190,Peta/Pelan Pengurusan Risiko Bencana,Pusat Pemindahan Sementara,Zon Selatan,4,MELAKA,RTMP Alor Gajah
191,Peta/Pelan Pengurusan Risiko Bencana,Lokasi Pusat Pemindahan Kekal (PPK),Zon Timur,3,KELANTAN,RTMD Ketereh
192,Peta/Pelan Pengurusan Risiko Bencana,Lokasi Pusat Pemindahan Kekal (PPK),Zon Timur,11,TERENGGANU,RTD H.Terengganu
193,Peta/Pelan Pengurusan Risiko Bencana,Lokasi Pusat Pemindahan Kekal (PPK),Zon Timur,11,TERENGGANU,RTD Marang
194,Peta/Pelan Pengurusan Risiko Bencana,Lokasi Pusat Pemindahan Kekal (PPK),Zon Timur,6,PAHANG,RTD Rompin
195,Peta/Pelan Pengurusan Risiko Bencana,Lokasi Pusat Pemindahan Kekal (PPK),Zon Selatan,4,MELAKA,RTMP Alor Gajah
196,Peta/Pelan Pengurusan Risiko Bencana,Lain-lain Aspek Geobencana,Zon Tengah,8,PERAK,RTD Mualim
197,Peta/Pelan Pengurusan Risiko Bencana,Lain-lain Aspek Geobencana,Zon Selatan,1,JOHOR,RTD Muar
198,Peta/Pelan Pengurusan Risiko Bencana,Lain-lain Aspek Geobencana,Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
199,Peta/Pelan Pengurusan Risiko Bencana,Lain-lain Aspek Geobencana,Zon Selatan,5,NEGERI SEMBILAN,RTD Jelebu
200,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Timur,3,KELANTAN,RTMD Ketereh
201,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Timur,11,TERENGGANU,RTD Setiu
202,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Timur,11,TERENGGANU,RTD H.Terengganu
203,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Timur,11,TERENGGANU,RTD Marang
204,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Timur,6,PAHANG,RTD Bera
205,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Timur,6,PAHANG,RTD Maran
206,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Timur,6,PAHANG,RTD Raub
207,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Timur,6,PAHANG,RTMD Lipis
208,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Timur,6,PAHANG,RTD Rompin
209,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Utara,2,KEDAH,RTD Baling
210,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Utara,2,KEDAH,RTD Sik
211,Program Pengurusan Risiko Geobencana,Program CBDRM,Zon Utara,2,KEDAH,RTD Yan
212,Program Pengurusan Risiko Geobencana,Program Kesedaran awam selain CBDRM,Zon Timur,6,PAHANG,RTD Temerloh
213,Program Pengurusan Risiko Geobencana,Program Kesedaran awam selain CBDRM,Zon Utara,2,KEDAH,RTD Baling
214,Program Pengurusan Risiko Bencana,Kajiselidik Bandar Berdaya Tahan Bencana,Zon Timur,3,KELANTAN,RTMD Ketereh
215,Program Pengurusan Risiko Bencana,Kajiselidik Bandar Berdaya Tahan Bencana,Zon Timur,11,TERENGGANU,RTD H.Terengganu
216,Program Pengurusan Risiko Bencana,Kajiselidik Bandar Berdaya Tahan Bencana,Zon Timur,11,TERENGGANU,RTD Marang
217,Program Pengurusan Risiko Bencana,Kajiselidik Bandar Berdaya Tahan Bencana,Zon Timur,6,PAHANG,RTD Bera
218,Program Pengurusan Risiko Bencana,Kajiselidik Bandar Berdaya Tahan Bencana,Zon Timur,6,PAHANG,RTMD Lipis
219,Program Pengurusan Risiko Bencana,Kajiselidik Bandar Berdaya Tahan Bencana,Zon Utara,2,KEDAH,RTD Yan
220,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,3,KELANTAN,RTJ Pasir Putih
221,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,3,KELANTAN,RTMD Ketereh
222,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,3,KELANTAN,RTJ Tumpat
223,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,3,KELANTAN,RTJ Kuala Krai
224,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,11,TERENGGANU,RTD Besut
225,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,11,TERENGGANU,RTD Setiu
226,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,11,TERENGGANU,RTD H.Terengganu
227,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,11,TERENGGANU,RTD Marang
228,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,6,PAHANG,RTD Bera
229,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,6,PAHANG,RTD Temerloh
230,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,6,PAHANG,RTD Maran
231,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,6,PAHANG,RTD Raub
232,Mitigasi Berstruktur (MB),Banjir (MB),Zon Timur,6,PAHANG,RTD Rompin
233,Mitigasi Berstruktur (MB),Banjir (MB),Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
234,Mitigasi Berstruktur (MB),Banjir (MB),Zon Tengah,10,SELANGOR,RTD Sabak Bernam
235,Mitigasi Berstruktur (MB),Banjir (MB),Zon Utara,2,KEDAH,RTD Baling
236,Mitigasi Berstruktur (MB),Banjir (MB),Zon Utara,2,KEDAH,RTD Padang Terap
237,Mitigasi Berstruktur (MB),Banjir (MB),Zon Utara,2,KEDAH,RTD Sik
238,Mitigasi Berstruktur (MB),Banjir (MB),Zon Utara,2,KEDAH,RTD Yan
239,Mitigasi Berstruktur (MB),Banjir (MB),Zon Selatan,1,JOHOR,RTD Kluang
240,Mitigasi Berstruktur (MB),Banjir (MB),Zon Selatan,1,JOHOR,RTD Muar
241,Mitigasi Berstruktur (MB),Banjir (MB),Zon Selatan,1,JOHOR,RT MBJB
242,Mitigasi Berstruktur (MB),Banjir (MB),Zon Selatan,1,JOHOR,RT MBIP
243,Mitigasi Berstruktur (MB),Banjir (MB),Zon Selatan,1,JOHOR,RTD Kota Tinggi
244,Mitigasi Berstruktur (MB),Banjir (MB),Zon Selatan,4,MELAKA,RTMP Alor Gajah
245,Mitigasi Berstruktur (MB),Banjir (MB),Zon Selatan,4,MELAKA,RT MPHTJ
246,Mitigasi Berstruktur (MB),Banjir (MB),Zon Selatan,4,MELAKA,RTMP Jasin
247,Mitigasi Berstruktur (MB),Banjir (MB),Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
248,Mitigasi Berstruktur (MB),Banjir (MB),Zon Selatan,5,NEGERI SEMBILAN,RTD Jelebu
249,Mitigasi Berstruktur (MB),Hakisan Pantai (MB),Zon Timur,11,TERENGGANU,RTD Besut
250,Mitigasi Berstruktur (MB),Hakisan Pantai (MB),Zon Timur,11,TERENGGANU,RTD Setiu
251,Mitigasi Berstruktur (MB),Hakisan Pantai (MB),Zon Timur,11,TERENGGANU,RTD Marang
252,Mitigasi Berstruktur (MB),Hakisan Pantai (MB),Zon Timur,6,PAHANG,RTD Rompin
253,Mitigasi Berstruktur (MB),Hakisan Pantai (MB),Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
254,Mitigasi Berstruktur (MB),Hakisan Pantai (MB),Zon Tengah,10,SELANGOR,RTD Sabak Bernam
255,Mitigasi Berstruktur (MB),Hakisan Pantai (MB),Zon Utara,2,KEDAH,RTD Yan
256,Mitigasi Berstructured (MB),Hakisan Pantai (MB),Zon Selatan,1,JOHOR,RTD Kota Tinggi
257,Mitigasi Berstruktur (MB),Hakisan Pantai (MB),Zon Selatan,4,MELAKA,RTMP Alor Gajah
258,Mitigasi Berstruktur (MB),Hakisan dan runtuhan tebing sungai (MB),Zon Timur,11,TERENGGANU,RTD Setiu
259,Mitigasi Berstruktur (MB),Hakisan dan runtuhan tebing sungai (MB),Zon Timur,11,TERENGGANU,RTD H.Terengganu
260,Mitigasi Berstruktur (MB),Hakisan dan runtuhan tebing sungai (MB),Zon Timur,6,PAHANG,RTD Temerloh
261,Mitigasi Berstruktur (MB),Hakisan dan runtuhan tebing sungai (MB),Zon Timur,6,PAHANG,RTD Maran
262,Mitigasi Berstruktur (MB),Tanah Runtuh (MB),Zon Timur,11,TERENGGANU,RTD H.Terengganu
263,Mitigasi Berstruktur (MB),Tanah Runtuh (MB),Zon Timur,6,PAHANG,RTD Maran
264,Mitigasi Berstruktur (MB),Tanah Runtuh (MB),Zon Timur,6,PAHANG,RTD Raub
265,Mitigasi Berstruktur (MB),Tanah Runtuh (MB),Zon Timur,6,PAHANG,RTD Rompin
266,Mitigasi Berstruktur (MB),Tanah Runtuh (MB),Zon Utara,2,KEDAH,RTD Yan
267,Mitigasi Berstruktur (MB),Tanah Runtuh (MB),Zon Selatan,4,MELAKA,RTMP Alor Gajah
268,Mitigasi Berstruktur (MB),Tanah Runtuh (MB),Zon Selatan,4,MELAKA,RT MPHTJ
269,Mitigasi Berstruktur (MB),Tanah Runtuh (MB),Zon Selatan,4,MELAKA,RTMP Jasin
270,Mitigasi Berstruktur (MB),Tanah Runtuh (MB),Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
271,Mitigasi Berstruktur (MB),Tsunami (MB),Zon Timur,3,KELANTAN,RTJ Tumpat
272,Mitigasi Berstruktur (MB),Tsunami (MB),Zon Timur,6,PAHANG,RTD Rompin
273,Mitigasi Berstruktur (MB),Tsunami (MB),Zon Tengah,10,SELANGOR,RTD Sabak Bernam
274,Mitigasi Berstruktur (MB),Tsunami (MB),Zon Utara,2,KEDAH,RTD Yan
275,Mitigasi Berstruktur (MB),Kenaikan Aras Laut (MB),Zon Timur,6,PAHANG,RTD Rompin
276,Mitigasi Berstruktur (MB),Kenaikan Aras Laut (MB),Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
277,Mitigasi Berstruktur (MB),Kenaikan Aras Laut (MB),Zon Tengah,10,SELANGOR,RTD Sabak Bernam
278,Mitigasi Berstruktur (MB),Kebakaran tanah Gambut (MB),Zon Timur,6,PAHANG,RTD Rompin
279,Mitigasi Berstruktur (MB),Kebakaran tanah Gambut (MB),Zon Tengah,10,SELANGOR,RTD Sabak Bernam
280,Mitigasi Berstruktur (MB),Kebakaran tanah Gambut (MB),Zon Selatan,1,JOHOR,RTD Muar
281,Mitigasi Berstruktur (MB),Kemarau (MB),Zon Tengah,10,SELANGOR,RTD Sabak Bernam
282,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,3,KELANTAN,RTJ Pasir Putih
283,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,3,KELANTAN,RTMD Ketereh
284,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,3,KELANTAN,RTJ Tumpat
285,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,3,KELANTAN,RTJ Kuala Krai
286,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,11,TERENGGANU,RTD Besut
287,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,11,TERENGGANU,RTD Setiu
288,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,11,TERENGGANU,RTD H.Terengganu
289,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,11,TERENGGANU,RTD Marang
290,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,6,PAHANG,RTD Bera
291,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,6,PAHANG,RTD Temerloh
292,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Timur,6,PAHANG,RTD Rompin
293,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Tengah,8,PERAK,RTD Kuala Kangsar
294,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Tengah,8,PERAK,RTMB Ipoh
295,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Tengah,8,PERAK,RTD Batang Padang
296,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Tengah,8,PERAK,RTD Mualim
297,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Tengah,8,PERAK,RTD Hilir Perak
298,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Tengah,10,SELANGOR,RTMP Klang
299,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Tengah,10,SELANGOR,RTD Sabak Bernam
300,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Utara,2,KEDAH,RTD Pendang
301,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Utara,2,KEDAH,RTD Baling
302,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Utara,2,KEDAH,RTD Padang Terap
303,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Utara,2,KEDAH,RTD Sik
304,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Selatan,1,JOHOR,RTD Kluang
305,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Selatan,1,JOHOR,RTD Muar
306,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Selatan,1,JOHOR,RT MBJB
307,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Selatan,1,JOHOR,RT MBIP
308,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Selatan,1,JOHOR,RTD Kota Tinggi
309,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Selatan,4,MELAKA,RTMP Alor Gajah
310,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Selatan,4,MELAKA,RTMP Jasin
311,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
312,Mitigasi Tidak Berstruktur (MTB),Banjir (MTB),Zon Selatan,5,NEGERI SEMBILAN,RTD Jelebu
313,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Timur,3,KELANTAN,RTJ Pasir Putih
314,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Timur,11,TERENGGANU,RTD Setiu
315,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Timur,11,TERENGGANU,RTD Marang
316,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Timur,6,PAHANG,RTD Rompin
317,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Tengah,8,PERAK,RTD Hilir Perak
318,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Tengah,10,SELANGOR,RTMP Klang
319,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Tengah,10,SELANGOR,RTMP Kuala Selangor
320,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Tengah,10,SELANGOR,RTD Sabak Bernam
321,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Utara,2,KEDAH,RTD Yan
322,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Selatan,1,JOHOR,RTD Muar
323,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Selatan,1,JOHOR,RT MBJB
324,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Selatan,1,JOHOR,RTD Kota Tinggi
325,Mitigasi Tidak Berstruktur (MTB),Hakisan Pantai (MTB),Zon Selatan,4,MELAKA,RTMP Jasin
326,Mitigasi Tidak Berstruktur (MTB),Hakisan dan runtuhan tebing sungai (MTB),Zon Timur,11,TERENGGANU,RTD H.Terengganu
327,Mitigasi Tidak Berstruktur (MTB),Hakisan dan runtuhan tebing sungai (MTB),Zon Timur,6,PAHANG,RTD Temerloh
328,Mitigasi Tidak Berstruktur (MTB),Hakisan dan runtuhan tebing sungai (MTB),Zon Timur,6,PAHANG,RTD Maran
329,Mitigasi Tidak Berstruktur (MTB),Hakisan dan runtuhan tebing sungai (MTB),Zon Timur,6,PAHANG,RTD Raub
330,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Timur,11,TERENGGANU,RTD H.Terengganu
331,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Timur,6,PAHANG,RTD Temerloh
332,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Timur,6,PAHANG,RTD Maran
333,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Timur,6,PAHANG,RTD Raub
334,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Tengah,8,PERAK,RTD Kuala Kangsar
335,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Tengah,8,PERAK,RTD Mualim
336,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Tengah,8,PERAK,RTD Hilir Perak
337,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Tengah,10,SELANGOR,RTMP Klang
338,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Utara,2,KEDAH,RTD Padang Terap
339,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Utara,2,KEDAH,RTD Yan
340,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Selatan,1,JOHOR,RT MBJB
341,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Selatan,4,MELAKA,RTMP Jasin
342,Mitigasi Tidak Berstruktur (MTB),Tanah Runtuh (MTB),Zon Selatan,5,NEGERI SEMBILAN,RTD Rembau
343,Mitigasi Tidak Berstruktur (MTB),Kenaikan Aras Laut (MTB),Zon Timur,3,KELANTAN,RTJ Tumpat
344,Mitigasi Tidak Berstruktur (MTB),Kenaikan Aras Laut (MTB),Zon Tengah,8,PERAK,RTMB Ipoh
345,Mitigasi Tidak Berstruktur (MTB),Kenaikan Aras Laut (MTB),Zon Tengah,8,PERAK,RTD Hilir Perak
346,Mitigasi Tidak Berstruktur (MTB),Kenaikan Aras Laut (MTB),Zon Tengah,10,SELANGOR,RTMP Klang
347,Mitigasi Tidak Berstruktur (MTB),Kenaikan Aras Laut (MTB),Zon Tengah,10,SELANGOR,RTD Sabak Bernam
348,Mitigasi Tidak Berstruktur (MTB),Kenaikan Aras Laut (MTB),Zon Selatan,1,JOHOR,RTD Muar
349,Mitigasi Tidak Berstruktur (MTB),Kenaikan Aras Laut (MTB),Zon Selatan,1,JOHOR,RT MBJB
350,Mitigasi Tidak Berstruktur (MTB),Kenaikan Aras Laut (MTB),Zon Selatan,1,JOHOR,RTD Kota Tinggi
351,Mitigasi Tidak Berstruktur (MTB),Kenaikan Aras Laut (MTB),Zon Selatan,4,MELAKA,RTMP Jasin
352,Mitigasi Tidak Berstruktur (MTB),Kebakaran tanah Gambut (MTB),Zon Selatan,1,JOHOR,RTD Muar
353,Mitigasi Tidak Berstruktur (MTB),"Tanah Mendap, Lubang Benam / Runtuhan Batu (MTB)",Zon Tengah,8,PERAK,RTD Kuala Kangsar
354,Mitigasi Tidak Berstruktur (MTB),"Tanah Mendap, Lubang Benam / Runtuhan Batu (MTB)",Zon Tengah,8,PERAK,RTMB Ipoh
355,Mitigasi Tidak Berstruktur (MTB),"Tanah Mendap, Lubang Benam / Runtuhan Batu (MTB)",Zon Tengah,10,SELANGOR,RTD Sabak Bernam
356,Mitigasi Tidak Berstruktur (MTB),"Tanah Mendap, Lubang Benam / Runtuhan Batu (MTB)",Zon Utara,2,KEDAH,RTD Padang Terap
357,Mitigasi Tidak Berstruktur (MTB),"Tanah Mendap, Lubang Benam / Runtuhan Batu (MTB)",Zon Selatan,4,MELAKA,RTMP Jasin`;

const parseCSV = (csv: string) => {
  const lines = csv.split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj: any, header, i) => {
      obj[header.trim()] = values[i]?.trim();
      return obj;
    }, {});
  }).filter(r => r.objectid);
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeData] = useState<DashboardData | null>({
    name: 'Disaster_Risk_Data.csv',
    content: DEFAULT_CSV,
    type: 'csv',
    uploadedAt: new Date()
  });

  const parsedRecords = useMemo(() => activeData ? parseCSV(activeData.content) : [], [activeData]);

  const fullContent = useMemo(() => {
    if (parsedRecords.length === 0) return "";
    const headers = Object.keys(parsedRecords[0]).join(',');
    const body = parsedRecords.map(r => Object.values(r).join(',')).join('\n');
    return headers + '\n' + body;
  }, [parsedRecords]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: inputText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await geminiService.analyzeData(inputText, fullContent, messages);
      const chartRegex = /```json_chart\s*([\s\S]*?)\s*```/;
      const match = response.match(chartRegex);
      let cleanText = response;
      let chartData = undefined;

      if (match) {
        try {
          chartData = JSON.parse(match[1]);
          cleanText = response.replace(chartRegex, '').trim();
        } catch (e) {
          console.error("Chart Parse Error:", e);
        }
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: cleanText,
        timestamp: new Date(),
        chartData
      }]);
    } catch (error) {
      console.error("Analysis Error:", error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Maaf, sistem mengalami ralat semasa memproses data anda. Sila cuba sebentar lagi.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-emerald-50 font-sans overflow-hidden">
      <header className="bg-slate-950/90 backdrop-blur-md border-b border-emerald-900/20 p-4 z-20 sticky top-0">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] rotate-45">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-950 -rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14h.1" /><path d="m21 3-9 9" /><path d="m15 3h6v6" /></svg>
            </div>
            <div>
              <h1 className="text-sm font-black text-white uppercase tracking-[0.2em] leading-none">Insight Agent</h1>
              <p className="text-[8px] text-emerald-500/50 font-bold uppercase tracking-tighter mt-1">Sistem Analisis Risiko Bencana</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex flex-col items-end mr-2">
                <span className="text-[8px] text-emerald-500/30 font-black uppercase tracking-widest">Database</span>
                <span className="text-[10px] font-bold text-emerald-400">{parsedRecords.length} Rekod Dimuatkan</span>
             </div>
             <button onClick={clearChat} className="p-2.5 bg-slate-900 border border-emerald-900/30 text-emerald-500/60 hover:text-emerald-400 hover:border-emerald-500/50 rounded-xl transition-all" title="Bersihkan Sembang">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 bg-slate-900/50 custom-scrollbar flex flex-col items-center">
        <div className="max-w-4xl w-full flex-1 flex flex-col gap-8 pb-32">
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 animate-in fade-in zoom-in duration-1000">
               <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mb-8 border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
               </div>
               <h2 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-4">Neural Deep Analysis</h2>
               <p className="text-emerald-500/40 text-xs font-bold uppercase tracking-widest max-w-sm leading-relaxed">
                 Sistem sedia untuk memproses kesemua {parsedRecords.length} pangkalan data risiko bencana. Tanya saya tentang jumlah kes, perbandingan zon, atau rumusan strategik.
               </p>
               <div className="mt-12 flex flex-wrap justify-center gap-3">
                  {[
                    "Analisis keseluruhan 357 rekod",
                    "Bandingkan risiko ikut zon utama",
                    "Senarai negeri dengan risiko paling tinggi",
                    "Beri rumusan strategik geobencana"
                  ].map(q => (
                    <button key={q} onClick={() => setInputText(q)} className="px-5 py-2.5 rounded-2xl bg-slate-950 border border-emerald-900/30 text-[10px] font-black uppercase tracking-widest text-emerald-500/60 hover:text-emerald-400 hover:border-emerald-500/50 transition-all active:scale-95">
                      {q}
                    </button>
                  ))}
               </div>
            </div>
          )}

          {messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-4 fade-in duration-500`}>
              <div className={`max-w-[90%] md:max-w-[80%] px-6 py-5 rounded-[2rem] ${m.role === 'user' ? 'bg-emerald-600 text-white shadow-xl rounded-tr-none' : 'bg-slate-950/80 border border-emerald-900/30 text-emerald-50 rounded-tl-none shadow-2xl relative overflow-hidden group'}`}>
                {m.role === 'assistant' && <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>}
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{m.content}</div>
                
                {m.chartData && (
                  <div className="mt-8 border-t border-emerald-500/10 pt-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400/60 mb-6 flex items-center gap-2">
                       <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                       {m.chartData.title}
                    </h4>
                    <div className="h-[300px] w-full min-w-[280px]">
                      <ChartRenderer chart={m.chartData} />
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[8px] font-bold text-emerald-900 uppercase tracking-widest mt-2 px-2">
                {m.role === 'user' ? 'You' : 'Agent'} • {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex flex-col items-start animate-pulse">
               <div className="bg-slate-950/80 border border-emerald-900/30 px-8 py-5 rounded-[2rem] rounded-tl-none flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500/40">Neural link processing...</span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-10">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSendMessage} className="relative group">
            <div className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <input 
              type="text" 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder="Analisis kesemua 357 rekod..." 
              className="w-full pl-8 pr-44 py-5 bg-slate-900/80 border border-emerald-900/30 rounded-[2.5rem] focus:ring-2 focus:ring-emerald-500/30 text-emerald-50 text-sm shadow-2xl outline-none backdrop-blur-xl transition-all placeholder-emerald-900/40" 
            />
            <button 
              type="submit" 
              disabled={!inputText.trim() || isLoading} 
              className="absolute right-3 top-3 bottom-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-emerald-900/30 text-white px-10 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 shadow-lg flex items-center gap-2"
            >
              {isLoading ? 'Scanning...' : (
                <>
                  Analyze
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </>
              )}
            </button>
          </form>
          <div className="flex justify-between items-center px-6 mt-4">
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[8px] font-black uppercase text-emerald-500/30 tracking-widest">Deep Matrix Active</span>
             </div>
             <p className="text-[8px] font-black uppercase text-emerald-500/20 tracking-[0.1em]">AI sedia menganalisis 357 rekod serentak</p>
          </div>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #064e3b; border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default App;