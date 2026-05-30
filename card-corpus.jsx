// Full corpus — 100 documented events, 1492–1882, plus 3 natural disasters.
// Compiled from the multi-source inventory (Morris, Barnai, Ayalon, Cohen,
// David, Gerber, Burckhardt, Schwarz, Finn, Frumkin, Lewis, Eliav, Yaari).
//
// Keys: y=year (start of range), c=category, m=intensity 1–5, p=place,
//       t=concise description, s=source.
window.CORPUS = [
  // ── Immigration ──────────────────────────────────────────────────────────
  { y: 1492, c: "immigration", m: 4, p: "Safed · Jerusalem · Hebron · Tiberias", t: "Iberian Sefardim — 1492 exiles + chain migration; 945 hh, near-parity with Muslims at Safed's 1567 peak.", s: "Lewis–Cohen defter; David 1999" },
  { y: 1555, c: "immigration", m: 2, p: "Safed", t: "Italian-peninsula Sefardim — Apulia, Calabria, Italian-rite congregations (75 hh) named in the defter.", s: "Defter 1555–6; David 1999" },
  { y: 1556, c: "immigration", m: 2, p: "Safed", t: "Maghrebi Jews from North Africa (38 hh), retaining a distinct communal identity.", s: "Defter 1555–6; Lewis–Cohen 1978" },
  { y: 1557, c: "immigration", m: 2, p: "Safed", t: "German & Hungarian Ashkenazi minority (32 hh) via Italy; named congregations in the defter.", s: "Defter 1555–6" },
  { y: 1563, c: "immigration", m: 3, p: "Tiberias", t: "Don Joseph Nasi's state-sponsored Tiberias revival — walls rebuilt, silk planted; failed by his death.", s: "Sultanic firman; David 1999" },
  { y: 1650, c: "immigration", m: 4, p: "Four holy cities", t: "Continuous Sephardi pilgrimage-into-settlement (6–8K) — ~80%+ of the Old Yishuv through the 18th c.", s: "Barnai; R. Simha of Zalozce 1764" },
  { y: 1665, c: "immigration", m: 3, p: "Hebron", t: "Internal redistribution after Tiberias' destruction + Sabbatean refugees; ~25× growth across the century.", s: "Ayalon 2025; Scholem; Rozen" },
  { y: 1700, c: "immigration", m: 4, p: "Jerusalem", t: "R. Judah Hasid's Polish-Sabbatean wave — ~1,500 left Europe, many died en route; founded the Hurva courtyard.", s: "Barnai; Ayalon 2025" },
  { y: 1740, c: "immigration", m: 3, p: "Tiberias", t: "R. Hayim Abulafia rebuilds Tiberias under Dahir al-Umar's protection — synagogue, press, vineyards.", s: "Barnai" },
  { y: 1741, c: "immigration", m: 2, p: "Jerusalem", t: "R. Hayyim ibn Attar (Or Ha-Hayyim) + students from Morocco; founded Knesseth Israel yeshiva.", s: "Barnai" },
  { y: 1777, c: "immigration", m: 3, p: "Safed · Tiberias", t: "The great Hasidic aliyah — ~300 under Menahem-Mendel of Vitebsk; founding of the Habad-precursor presence.", s: "Barnai; Hasidic historiography" },
  { y: 1812, c: "immigration", m: 3, p: "Jerusalem", t: "Vilna Perushim — post-plague Lithuanian mitnagdim anchor the Ashkenazi reconstitution of Jerusalem.", s: "Barnai; Blumberg" },
  { y: 1838, c: "immigration", m: 5, p: "Jerusalem · Hebron · Safed · Tiberias · Jaffa", t: "The 'Zero Aliyah' — ~25–45K via British consular protection over 44 yrs; larger than the entire First Aliyah.", s: "Eliav 1997, Appendix 2" },

  // ── Violence ─────────────────────────────────────────────────────────────
  { y: 1516, c: "violence", m: 3, p: "Hebron", t: "Community decimated in rioting during the Ottoman conquest; ~half the families remained.", s: "David 1999" },
  { y: 1517, c: "violence", m: 3, p: "Safed", t: "Pogrom during the Mamluk–Ottoman transition — quarter sacked; community fled naked to the villages.", s: "David 1999" },
  { y: 1599, c: "violence", m: 2, p: "Ein Zeitim · Meron · Birya", t: "Anti-Jewish brigandage; the yeshivah relocated to Safed, ending settlement in these Galilee villages.", s: "David 1999; Shlomil 1607" },
  { y: 1604, c: "violence", m: 3, p: "Safed", t: "Druze massacre; Jews escaped to Damascus. By 1653 Safed was practically devoid of Jews.", s: "Ayalon 2025" },
  { y: 1625, c: "violence", m: 4, p: "Jerusalem", t: "Governor Ibn Farrukh's disturbances — Sabbath synagogue raid, 15 hostages, mock executions; a leader killed.", s: "David 1999; Schwarz 1850" },
  { y: 1660, c: "violence", m: 4, p: "Tiberias", t: "Destruction of the city in a factional crisis; the Jewish community totally dispersed.", s: "Scholem; d'Arvieux 1660" },
  { y: 1666, c: "violence", m: 3, p: "Tiberias", t: "Tiberias destroyed by incessant wars (Bedouin, Druze, Maronite, Metouali); community dispersed.", s: "Barnai 1992" },
  { y: 1720, c: "violence", m: 5, p: "Jerusalem", t: "Muslim creditors burned the Ashkenazi synagogue compound — the Hurva; community destroyed and dispersed.", s: "Barnai 1992; Ayalon 2025" },
  { y: 1799, c: "violence", m: 3, p: "Safed", t: "Jewish quarter completely sacked by Ottoman troops after the French retreat from Acre.", s: "Burckhardt 1822" },
  { y: 1817, c: "violence", m: 3, p: "Acre", t: "Murder of Haym Pharchi, Jewish minister and protector, by Abdalla Pasha; his wife likely poisoned.", s: "Schwarz 1850" },
  { y: 1834, c: "violence", m: 5, p: "Safed", t: "Six-week sack of the quarter in the Peasants' Revolt — synagogues desecrated, Torah scrolls cut to pieces.", s: "Schwarz 1850; Keter vol. 8" },
  { y: 1835, c: "violence", m: 4, p: "Hebron", t: "Ibrahim Pasha's troops sacked the city after storming it; five Jews purposely murdered, the quarter stripped.", s: "Schwarz 1850; Keter vol. 8" },
  { y: 1836, c: "violence", m: 3, p: "Tiberias", t: "Rebels locked the Jews in their quarter and demanded an immense ransom.", s: "Schwarz 1850" },
  { y: 1838, c: "violence", m: 4, p: "Safed", t: "Druze plundered the devastated quarter during the revolt against Ibrahim Pasha — the last of its prosperity.", s: "Schwarz 1850; Mishaqa" },
  { y: 1840, c: "violence", m: 4, p: "Damascus", t: "Blood libel after Father Thomas vanished — 7 elders tortured, 2 died, 63 children imprisoned.", s: "Schwarz; Mishaqa; Frankel 1997" },
  { y: 1846, c: "violence", m: 3, p: "Hebron", t: "Factional warfare; Jews caught in the crossfire when the Pasha of Jerusalem stormed Hebron — many wounded.", s: "Schwarz 1850" },
  { y: 1853, c: "violence", m: 2, p: "Jerusalem", t: "A Jew beaten by a Turkish soldier — Consul Finn obtained redress at once.", s: "Finn 1878" },

  // ── Extortion ────────────────────────────────────────────────────────────
  { y: 1537, c: "extortion", m: 2, p: "Jerusalem", t: "Jews indebted to kadis — a possible elegant form of extortion; one Karaite owed 5,400 para.", s: "Cohen 1984" },
  { y: 1554, c: "extortion", m: 2, p: "Jerusalem–Hebron road", t: "Pilgrims extorted, beaten, imprisoned; officials falsely claimed the roads unsafe to force escort fees.", s: "Cohen 1984" },
  { y: 1556, c: "extortion", m: 2, p: "Jerusalem", t: "Comprehensive harassment — accusations of cursing Islam, homes seized for soldiers, forced holiday labor.", s: "Cohen 1984" },
  { y: 1560, c: "extortion", m: 2, p: "Jerusalem", t: "Subashi soldiers extort at the synagogue entrance; forced escort fees, bathhouse and grain-merchant levies.", s: "Cohen 1984" },
  { y: 1586, c: "extortion", m: 1, p: "Jerusalem", t: "A soldier extorts money and goods under false pretenses and harasses Jews at the synagogue door.", s: "Cohen 1984" },
  { y: 1589, c: "extortion", m: 1, p: "Jerusalem", t: "A soldier informs on Jews to the subashi; one dragged off and ransomed for a gold coin.", s: "Cohen 1984" },
  { y: 1623, c: "extortion", m: 2, p: "Jerusalem", t: "The pasha of Jerusalem oppressed the population with harsh decrees.", s: "Barnai 1992" },
  { y: 1626, c: "extortion", m: 4, p: "Jerusalem", t: "Ibn Paruch demanded 11,000 grush for 15 hostages; the community borrowed 50,000 grush; flight blocked.", s: "Schwarz via 1628 Venice" },
  { y: 1645, c: "extortion", m: 1, p: "Jerusalem", t: "A kadi extorts 500 guruş from imprisoned Jewish leaders.", s: "Rozen 2015" },
  { y: 1663, c: "extortion", m: 2, p: "Jerusalem", t: "The sum demanded was so high the elders could not raise it; many prominent scholars had to flee.", s: "Scholem" },
  { y: 1697, c: "extortion", m: 3, p: "Jerusalem", t: "Community owed 25,000 kuruş; 5.5 per person demanded; 200/yr in bribes 'so that they will not be punished.'", s: "Barnai 1992" },
  { y: 1710, c: "extortion", m: 4, p: "Jerusalem", t: "'Tax collectors flayed them alive'; new restrictions daily, leaders put in irons and beaten.", s: "Barnai 1992 (1711 doc)" },
  { y: 1722, c: "extortion", m: 4, p: "Jerusalem", t: "A new ruler demanded 91,000 kuruş within 91 days and arrested community official R. Moses Meyuhas.", s: "Barnai 1992" },
  { y: 1728, c: "extortion", m: 2, p: "Safed", t: "Burial prohibition + extortion; an open city, peasants entered freely to rob and persecute Jews.", s: "Barnai 1992" },
  { y: 1744, c: "extortion", m: 2, p: "Hebron", t: "'The creditor raises his hand against them with whips, and beats and wounds.'", s: "Barnai 1992 (Hebron letter)" },
  { y: 1745, c: "extortion", m: 2, p: "Safed", t: "Extortion escalated under Dahir al-Umar's son — 'we had to climb high mountains and hills to flee.'", s: "Barnai (Malkhi letter)" },
  { y: 1746, c: "extortion", m: 2, p: "Jaffa–Jerusalem road", t: "Pilgrim entry tax doubled; new 20-kuruş road tax; the Jaffa governor ceased providing escort.", s: "Cohen 1973" },
  { y: 1750, c: "extortion", m: 2, p: "Jerusalem", t: "Burial extortion — preventing Jewish burial to extract money; Istanbul intervened repeatedly.", s: "Barnai 1992; Cohen 1973" },
  { y: 1751, c: "extortion", m: 3, p: "Jerusalem", t: "Comprehensive extra-legal taxation — 8+ named imposts (kudumiye, mufakhare, festival tribute, burial, wood…).", s: "Cohen 1973" },
  { y: 1755, c: "extortion", m: 3, p: "Jerusalem", t: "'Every day they take a person — a sage or a rich man — and beat him until he gives them what they want.'", s: "Barnai (de-Gilderin letter)" },
  { y: 1763, c: "extortion", m: 1, p: "Safed", t: "Battle expenses demanded from the Jews during a factional war among Dahir's sons.", s: "Barnai 1992" },
  { y: 1764, c: "extortion", m: 2, p: "Jaffa–Jerusalem road", t: "Bedouin collect 1–3 paras at multiple points; the Shaykh of Abu Ghosh levies new caravan taxes.", s: "Cohen 1973" },
  { y: 1765, c: "extortion", m: 1, p: "Hebron–Jerusalem road", t: "R. Azulay's diary — village shaykhs of Halhul, Yata and Samea 'distressed us… demanded a large sum.'", s: "Barnai (Azulay diary)" },
  { y: 1775, c: "extortion", m: 4, p: "Acre · Galilee", t: "Jezzar Pasha's regime — the cizye raised fivefold (4,400 → 23,650 kuruş); 'demand any sum he liked.'", s: "Cohen 1973; Burckhardt 1822" },
  { y: 1781, c: "extortion", m: 1, p: "Jerusalem", t: "A synagogue collapsed under snow; large sums paid to the Pasha of Damascus to rebuild.", s: "Barnai 1992" },
  { y: 1784, c: "extortion", m: 3, p: "Tiberias", t: "Jezzar's grain monopoly — cereal prices rose 400%; the Ashkenazi head reported famine conditions.", s: "Cohen 1973 (1785 letter)" },
  { y: 1799, c: "extortion", m: 4, p: "Jerusalem · Acre", t: "Jews accused of collaborating with Napoleon; 125,000 kuruş in bribes paid to rulers during the war.", s: "Barnai 1992 (debt tables)" },
  { y: 1818, c: "extortion", m: 3, p: "Acre · Safed · Tiberias", t: "After murdering Pharchi, Abdalla Pasha persecuted all Galilee Jews; Safed Jews sold their garments for ransom.", s: "Schwarz 1850" },
  { y: 1841, c: "extortion", m: 3, p: "Hebron", t: "Sheikh Abd al-Rachman — 'an insatiable leech'; his extortion drove most of Hebron's Jews to Jerusalem.", s: "Schwarz 1850" },
  { y: 1854, c: "extortion", m: 2, p: "Hebron", t: "Finn intervened for Hebron's Jews against oppression by the townspeople.", s: "Finn 1878" },

  // ── Expulsion ────────────────────────────────────────────────────────────
  { y: 1576, c: "expulsion", m: 4, p: "Safed", t: "Murad III ordered the 1,000 wealthiest families deported to Cyprus (sürgün); rescinded 1578.", s: "David 1999; Lewis" },
  { y: 1579, c: "expulsion", m: 2, p: "Safed · Famagusta", t: "The Cypriot governor diverted 100 Salonikan Jews in transit to Safed; firman approved.", s: "David 1999" },
  { y: 1580, c: "expulsion", m: 2, p: "Jerusalem", t: "Egyptian pilgrims arrested at the gates; the kadi ordered them out within 15 days on a false petition.", s: "Cohen 1984" },
  { y: 1587, c: "expulsion", m: 3, p: "Jerusalem", t: "The main synagogue confiscated by Abu Seifin; the kadi forbade its use — decades without an official synagogue.", s: "David 1999" },
  { y: 1600, c: "expulsion", m: 2, p: "Ein Zeitim · Meron · Birya", t: "Anti-Jewish brigandage permanently emptied three Galilee villages — 'abandoned synagogues, no inhabitants.'", s: "David 1999 (1607 letter)" },
  { y: 1605, c: "expulsion", m: 3, p: "Safed", t: "The Druze massacre triggered mass flight to Damascus; by 1653 Safed was practically devoid of Jews.", s: "Ayalon 2025" },
  { y: 1654, c: "expulsion", m: 4, p: "Jerusalem", t: "Ashkenazim 15,000 reichsthalers in debt — synagogue closed, leaders jailed; ~400 of 700 poor famished.", s: "Ayalon 2025; Rozen 2015" },
  { y: 1721, c: "expulsion", m: 4, p: "Jerusalem", t: "After the Hurva burning, Ashkenazim fled — virtually none for decades; returnees disguised as Sephardim.", s: "Barnai 1992; Ayalon 2025" },
  { y: 1741, c: "expulsion", m: 2, p: "Jerusalem", t: "Attempts to expel Jews as the community grew; Jews barred from buying food — averted by bribe.", s: "Barnai 1992" },
  { y: 1756, c: "expulsion", m: 3, p: "Jerusalem", t: "More than two hundred left the city, fleeing in the night — 'difficult to live in the city.'", s: "Barnai (de-Gilderin letter)" },
  { y: 1765, c: "expulsion", m: 2, p: "Hebron", t: "Hebron officials petitioned Istanbul — 'let us replace the Jews… so the name of Israel be no longer remembered.'", s: "Barnai 1992" },
  { y: 1842, c: "expulsion", m: 3, p: "Hebron", t: "Abd al-Rachman's extortion drove the greater part of Hebron's Jews to resettle in Jerusalem.", s: "Schwarz 1850" },

  // ── Halukah (diaspora support) ─────────────────────────────────────────────
  { y: 1550, c: "halukah", m: 3, p: "Palestine ← diaspora", t: "The sheluchim system established — envoys from the four holy cities collect charity across the diaspora.", s: "Yaari, Sheluchei E.Y. 1951" },
  { y: 1626, c: "halukah", m: 3, p: "Jerusalem → Italy", t: "Italian collection after Ibn Farrukh — 50,000 grush borrowed at 40%; emissaries sent to relieve the city.", s: "Schwarz 1850" },
  { y: 1655, c: "halukah", m: 3, p: "Jerusalem → London", t: "Ashkenazi crisis appeal — 15,000 reichsthalers in debt; the first English-language Palestine appeal (Jessey).", s: "Ayalon 2025; Rozen 2015" },
  { y: 1656, c: "halukah", m: 3, p: "Jerusalem → Amsterdam", t: "R. Nathan Shapira's mission after the Chmielnicki cutoff — 6,000 RT + £300; barely covered the interest.", s: "Yaari 1951" },
  { y: 1685, c: "halukah", m: 2, p: "Jerusalem → Hamburg", t: "R. Moshe HaKohen's mission — the first-ever debt compromise: creditors waived interest and a third of principal.", s: "Yaari 1951" },
  { y: 1698, c: "halukah", m: 2, p: "Jerusalem ← diaspora", t: "Fundraising mobilized against a 25,000-kuruş debt and an annual bribe required to prevent violence.", s: "Barnai 1992" },
  { y: 1711, c: "halukah", m: 3, p: "Jerusalem ← Europe", t: "Fund-drive after the 'flayed alive' crisis raised 25,600 ducats — short of the 60,000 RT needed; Hurva burned.", s: "Barnai 1992; Schwarz 1850" },
  { y: 1713, c: "halukah", m: 3, p: "Vienna · Constantinople → Jerusalem", t: "Wertheim–Oppenheim axis — a permanent 'Jerusalem Fund' in the Austrian treasury, lasting until WWI.", s: "Yaari 1951" },
  { y: 1720, c: "halukah", m: 2, p: "Jerusalem ← Amsterdam", t: "Post-Hurva reconstruction — Amsterdam's Pekidim ve-Amarcalim organize decades of rebuilding funds.", s: "Barnai 1992; Ayalon 2025" },
  { y: 1723, c: "halukah", m: 3, p: "Jerusalem → Istanbul", t: "R. Raphael Meyuhas' rescue mission — Istanbul's court restrained the local ruler's 91,000-kuruş demand.", s: "Barnai 1992" },
  { y: 1729, c: "halukah", m: 3, p: "Vienna → Constantinople → Jerusalem", t: "Austrian-brokered Hurva settlement — 30,000 grush handed to creditors in court as a 'final settlement.'", s: "Cohen sijill 18th c." },
  { y: 1741, c: "halukah", m: 4, p: "Istanbul ↔ four holy cities", t: "The Istanbul Officials' Pinkas — 500+ letters: the operational backbone of 18th-c. Old Yishuv life.", s: "Lehmann 2014; Pinkas" },
  { y: 1770, c: "halukah", m: 4, p: "Jerusalem → Constantinople · Italy", t: "Algazi–Hazan's 5-year tour — debt at 70,000 lions; interest alone consumed all diaspora donations.", s: "Yaari 1951" },
  { y: 1776, c: "halukah", m: 3, p: "Acre · Galilee ← diaspora", t: "Halukah absorbs Jezzar's 5× cizye — 'served mainly for taxes and debts… little reached the people.'", s: "Barnai 1992; Cohen 1973" },
  { y: 1800, c: "halukah", m: 4, p: "Jerusalem · Acre ← diaspora", t: "Napoleonic-war emergency collection — 125,000 kuruş in bribes; ~70% of the community's annual living costs.", s: "Barnai 1992 (debt tables)" },
  { y: 1815, c: "halukah", m: 4, p: "Europe → Palestine", t: "Halukah as demographic engine — the Ashkenazi share rises ~25% → ~55% via supported religious migration.", s: "Barnai aggregate; Alroey" },
  { y: 1841, c: "halukah", m: 3, p: "Istanbul → Jerusalem", t: "A Gülhane-era firman protecting the Jerusalem synagogue and kollel — Tanzimat equality in practice.", s: "Cohen sijill 19th c." },

  // ── Institution ────────────────────────────────────────────────────────────
  { y: 1551, c: "institution", m: 2, p: "Jerusalem", t: "Bayt Mal al-Yahud — a state treasury farming heirless Jewish property; lease prices track the decline.", s: "Cohen sijill 16th c." },
  { y: 1854, c: "institution", m: 4, p: "Jerusalem", t: "Rothschild-funded hospital, lying-in charity and schools — the first modern European-Jewish infrastructure.", s: "Finn 1878" },
  { y: 1855, c: "institution", m: 4, p: "Jerusalem", t: "Montefiore's land purchase outside the walls under sultanic firman — the founding act of Mishkenot Sha'ananim.", s: "Finn 1878" },
  { y: 1856, c: "institution", m: 5, p: "Jerusalem", t: "Hatt-ı Hümayun proclaimed — all subjects equal; foreigners may own land, enabling every later purchase.", s: "Finn 1878; Morris 2001" },
  { y: 1860, c: "institution", m: 4, p: "Jerusalem", t: "Mishkenot Sha'ananim completed — the first Jewish residential quarter outside the Old City walls.", s: "Montefiore Diaries" },
  { y: 1862, c: "institution", m: 3, p: "Jerusalem", t: "Alliance Israélite Universelle school — French-secular education challenging the halukah-kollel model.", s: "Mandel 1976" },
  { y: 1869, c: "institution", m: 3, p: "Jaffa → Jerusalem", t: "First carriage road in Palestine — wheeled transport to the interior; a precondition for later settlement.", s: "Morris 2001" },
  { y: 1870, c: "institution", m: 4, p: "Near Jaffa", t: "Mikveh Israel agricultural school (Netter / AIU) — trained settlers who later founded First Aliyah colonies.", s: "Mandel 1976" },
  { y: 1874, c: "institution", m: 3, p: "Jerusalem", t: "Mea She'arim founded — a cooperative housing association; the second major extra-muros quarter.", s: "Ben-Arieh" },
  { y: 1878, c: "institution", m: 4, p: "Coastal plain", t: "Petah Tikva — the first Jewish agricultural colony; abandoned to malaria, resettled by First Aliyah in 1882.", s: "Morris 2001; Mandel 1976" },
  { y: 1881, c: "institution", m: 4, p: "Constantinople → Palestine", t: "The Hamidian barrier — Jewish immigrants may settle empire-wide EXCEPT Palestine; the partial reversal.", s: "Mandel 1976" },

  // ── Post-1882 additions — Hamidian / First-Aliyah era (to the eve of the Second Aliyah, 1904) ──
  { y: 1882, c: "immigration", m: 5, p: "Coastal plain · Galilee · Judean foothills", t: "First Aliyah — Hovevei Zion/Bilu colonies (Rishon LeZion, Rosh Pina, Zikhron Yaakov 1882; Gedera 1884); ~25–35K arrivals, ~50–60% yerida. Still pre-political-Zionism: Herzl 1896/97 had little on-the-ground effect before the Second Aliyah.", s: "Alroey; Mandel 1976" },
  { y: 1886, c: "violence", m: 2, p: "Petah Tikva", t: "First-Aliyah land/grazing clash with al-Yahudiyya — the colony attacked, one death. A different register: settler–fellahin frontier conflict, not dhimmi coercion.", s: "Frumkin" },
  { y: 1901, c: "institution", m: 3, p: "Basel → Palestine", t: "Jewish National Fund founded to buy and hold land as inalienable national property — the charity → capital turn.", s: "general" },
  { y: 1903, c: "institution", m: 2, p: "Jaffa · Jerusalem", t: "Anglo-Palestine Bank (later Bank Leumi) — the WZO's financial arm; capital infrastructure for the Second-Aliyah era.", s: "general" },
];

// Natural disasters — shown as a separate band; not anti-Jewish violence, but
// their disproportionate Jewish toll reflects impoverishment-driven housing.
window.DISASTERS = [
  { y: 1759, m: 3, p: "Safed", t: "Earthquake — ~140–150 Jewish dead.", s: "inventory" },
  { y: 1812, m: 5, p: "Galilee", t: "Plague — killed ~80% of Safed's population.", s: "inventory" },
  { y: 1837, m: 5, p: "Safed · Tiberias", t: "Earthquake — ~2,100 Jewish dead (of a 2,000–4,000 all-community total); more than all human violence combined.", s: "inventory; Keter" },
];

window.CORPUS_CATS = {
  violence:    { color: "#b0231a", label: "Violence",    n: 18 },
  extortion:   { color: "#c9941f", label: "Extortion",   n: 30 },
  expulsion:   { color: "#7d4f93", label: "Expulsion",   n: 12 },
  disaster:    { color: "#6b7280", label: "Disaster",    n: 3, aside: true },
  immigration: { color: "#2f63a6", label: "Immigration", n: 14 },
  halukah:     { color: "#1f8a7a", label: "Halukah",     n: 17 },
  institution: { color: "#3f8a55", label: "Institution", n: 13 },
};
// Lane order, top → bottom: coercion first, then the disasters aside, then build.
window.CORPUS_LANES = ["violence", "extortion", "expulsion", "disaster", "immigration", "halukah", "institution"];
