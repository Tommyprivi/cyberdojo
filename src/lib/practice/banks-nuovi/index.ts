// File generato da scripts/genera-nuovi-corsi.ts: non modificare a mano.
import { makeBank, type BankItem } from "../banks";
import { W01_ITEMS } from "./w01";
import { W02_ITEMS } from "./w02";
import { W03_ITEMS } from "./w03";
import { W04_ITEMS } from "./w04";
import { W05_ITEMS } from "./w05";
import { W06_ITEMS } from "./w06";
import { W07_ITEMS } from "./w07";
import { W08_ITEMS } from "./w08";
import { W09_ITEMS } from "./w09";
import { W10_ITEMS } from "./w10";
import { W11_ITEMS } from "./w11";
import { W12_ITEMS } from "./w12";
import { W13_ITEMS } from "./w13";
import { W14_ITEMS } from "./w14";
import { W15_ITEMS } from "./w15";
import { W16_ITEMS } from "./w16";
import { W17_ITEMS } from "./w17";
import { W18_ITEMS } from "./w18";
import { W19_ITEMS } from "./w19";
import { W20_ITEMS } from "./w20";
import { P01_ITEMS } from "./p01";
import { P02_ITEMS } from "./p02";
import { P03_ITEMS } from "./p03";
import { P04_ITEMS } from "./p04";
import { P05_ITEMS } from "./p05";
import { P06_ITEMS } from "./p06";
import { P07_ITEMS } from "./p07";
import { P08_ITEMS } from "./p08";
import { P09_ITEMS } from "./p09";
import { P10_ITEMS } from "./p10";
import { P11_ITEMS } from "./p11";
import { P12_ITEMS } from "./p12";
import { P13_ITEMS } from "./p13";
import { P14_ITEMS } from "./p14";
import { P15_ITEMS } from "./p15";
import { P16_ITEMS } from "./p16";
import { P17_ITEMS } from "./p17";
import { P18_ITEMS } from "./p18";
import { P19_ITEMS } from "./p19";
import { P20_ITEMS } from "./p20";
import { A01_ITEMS } from "./a01";
import { A02_ITEMS } from "./a02";
import { A03_ITEMS } from "./a03";
import { A04_ITEMS } from "./a04";
import { A05_ITEMS } from "./a05";
import { A06_ITEMS } from "./a06";
import { A07_ITEMS } from "./a07";
import { A08_ITEMS } from "./a08";
import { A09_ITEMS } from "./a09";
import { A10_ITEMS } from "./a10";
import { A11_ITEMS } from "./a11";
import { A12_ITEMS } from "./a12";
import { A13_ITEMS } from "./a13";
import { A14_ITEMS } from "./a14";
import { A15_ITEMS } from "./a15";
import { A16_ITEMS } from "./a16";
import { A17_ITEMS } from "./a17";
import { A18_ITEMS } from "./a18";
import { A19_ITEMS } from "./a19";
import { A20_ITEMS } from "./a20";
import { I01_ITEMS } from "./i01";
import { I02_ITEMS } from "./i02";
import { I03_ITEMS } from "./i03";
import { I04_ITEMS } from "./i04";
import { I05_ITEMS } from "./i05";
import { I06_ITEMS } from "./i06";
import { I07_ITEMS } from "./i07";
import { I08_ITEMS } from "./i08";
import { I09_ITEMS } from "./i09";
import { I10_ITEMS } from "./i10";
import { I11_ITEMS } from "./i11";
import { I12_ITEMS } from "./i12";
import { I13_ITEMS } from "./i13";
import { I14_ITEMS } from "./i14";
import { I15_ITEMS } from "./i15";
import { I16_ITEMS } from "./i16";
import { I17_ITEMS } from "./i17";
import { I18_ITEMS } from "./i18";
import { I19_ITEMS } from "./i19";
import { I20_ITEMS } from "./i20";
import { B01_ITEMS } from "./b01";
import { B02_ITEMS } from "./b02";
import { B03_ITEMS } from "./b03";
import { B04_ITEMS } from "./b04";
import { B05_ITEMS } from "./b05";
import { B06_ITEMS } from "./b06";
import { B07_ITEMS } from "./b07";
import { B08_ITEMS } from "./b08";
import { B09_ITEMS } from "./b09";
import { B10_ITEMS } from "./b10";
import { B11_ITEMS } from "./b11";
import { B12_ITEMS } from "./b12";
import { B13_ITEMS } from "./b13";
import { B14_ITEMS } from "./b14";
import { B15_ITEMS } from "./b15";
import { B16_ITEMS } from "./b16";
import { B17_ITEMS } from "./b17";
import { B18_ITEMS } from "./b18";
import { B19_ITEMS } from "./b19";
import { B20_ITEMS } from "./b20";
import { L01_ITEMS } from "./l01";
import { L02_ITEMS } from "./l02";
import { L03_ITEMS } from "./l03";
import { L04_ITEMS } from "./l04";
import { L05_ITEMS } from "./l05";
import { L06_ITEMS } from "./l06";
import { L07_ITEMS } from "./l07";
import { L08_ITEMS } from "./l08";
import { L09_ITEMS } from "./l09";
import { L10_ITEMS } from "./l10";
import { L11_ITEMS } from "./l11";
import { L12_ITEMS } from "./l12";
import { L13_ITEMS } from "./l13";
import { L14_ITEMS } from "./l14";
import { L15_ITEMS } from "./l15";
import { L16_ITEMS } from "./l16";
import { L17_ITEMS } from "./l17";
import { L18_ITEMS } from "./l18";
import { L19_ITEMS } from "./l19";
import { L20_ITEMS } from "./l20";
import { R01_ITEMS } from "./r01";
import { R02_ITEMS } from "./r02";
import { R03_ITEMS } from "./r03";
import { R04_ITEMS } from "./r04";
import { R05_ITEMS } from "./r05";
import { R06_ITEMS } from "./r06";
import { R07_ITEMS } from "./r07";
import { R08_ITEMS } from "./r08";
import { R09_ITEMS } from "./r09";
import { R10_ITEMS } from "./r10";
import { R11_ITEMS } from "./r11";
import { R12_ITEMS } from "./r12";
import { R13_ITEMS } from "./r13";
import { R14_ITEMS } from "./r14";
import { R15_ITEMS } from "./r15";
import { R16_ITEMS } from "./r16";
import { R17_ITEMS } from "./r17";
import { R18_ITEMS } from "./r18";
import { R19_ITEMS } from "./r19";
import { R20_ITEMS } from "./r20";
import { E01_ITEMS } from "./e01";
import { E02_ITEMS } from "./e02";
import { E03_ITEMS } from "./e03";
import { E04_ITEMS } from "./e04";
import { E05_ITEMS } from "./e05";
import { E06_ITEMS } from "./e06";
import { E07_ITEMS } from "./e07";
import { E08_ITEMS } from "./e08";
import { E09_ITEMS } from "./e09";
import { E10_ITEMS } from "./e10";
import { E11_ITEMS } from "./e11";
import { E12_ITEMS } from "./e12";
import { E13_ITEMS } from "./e13";
import { E14_ITEMS } from "./e14";
import { E15_ITEMS } from "./e15";
import { E16_ITEMS } from "./e16";
import { E17_ITEMS } from "./e17";
import { E18_ITEMS } from "./e18";
import { E19_ITEMS } from "./e19";
import { E20_ITEMS } from "./e20";
import { X01_ITEMS } from "./x01";
import { X02_ITEMS } from "./x02";
import { X03_ITEMS } from "./x03";
import { X04_ITEMS } from "./x04";
import { X05_ITEMS } from "./x05";
import { X06_ITEMS } from "./x06";
import { X07_ITEMS } from "./x07";
import { X08_ITEMS } from "./x08";
import { X09_ITEMS } from "./x09";
import { X10_ITEMS } from "./x10";
import { X11_ITEMS } from "./x11";
import { X12_ITEMS } from "./x12";
import { X13_ITEMS } from "./x13";
import { X14_ITEMS } from "./x14";
import { X15_ITEMS } from "./x15";
import { X16_ITEMS } from "./x16";
import { X17_ITEMS } from "./x17";
import { X18_ITEMS } from "./x18";
import { X19_ITEMS } from "./x19";
import { X20_ITEMS } from "./x20";
import { M01_ITEMS } from "./m01";
import { M02_ITEMS } from "./m02";
import { M03_ITEMS } from "./m03";
import { M04_ITEMS } from "./m04";
import { M05_ITEMS } from "./m05";
import { M06_ITEMS } from "./m06";
import { M07_ITEMS } from "./m07";
import { M08_ITEMS } from "./m08";
import { M09_ITEMS } from "./m09";
import { M10_ITEMS } from "./m10";
import { M11_ITEMS } from "./m11";
import { M12_ITEMS } from "./m12";
import { M13_ITEMS } from "./m13";
import { M14_ITEMS } from "./m14";
import { M15_ITEMS } from "./m15";
import { M16_ITEMS } from "./m16";
import { M17_ITEMS } from "./m17";
import { M18_ITEMS } from "./m18";
import { M19_ITEMS } from "./m19";
import { M20_ITEMS } from "./m20";

/** Tutte le banche dei 10 nuovi corsi (W, P, A, I, B, L, R, E, X, M), per identificatore (w01-..., p05-...). */
export const NUOVI_BANK_ITEMS: Record<string, BankItem[]> = {
  ...W01_ITEMS,
  ...W02_ITEMS,
  ...W03_ITEMS,
  ...W04_ITEMS,
  ...W05_ITEMS,
  ...W06_ITEMS,
  ...W07_ITEMS,
  ...W08_ITEMS,
  ...W09_ITEMS,
  ...W10_ITEMS,
  ...W11_ITEMS,
  ...W12_ITEMS,
  ...W13_ITEMS,
  ...W14_ITEMS,
  ...W15_ITEMS,
  ...W16_ITEMS,
  ...W17_ITEMS,
  ...W18_ITEMS,
  ...W19_ITEMS,
  ...W20_ITEMS,
  ...P01_ITEMS,
  ...P02_ITEMS,
  ...P03_ITEMS,
  ...P04_ITEMS,
  ...P05_ITEMS,
  ...P06_ITEMS,
  ...P07_ITEMS,
  ...P08_ITEMS,
  ...P09_ITEMS,
  ...P10_ITEMS,
  ...P11_ITEMS,
  ...P12_ITEMS,
  ...P13_ITEMS,
  ...P14_ITEMS,
  ...P15_ITEMS,
  ...P16_ITEMS,
  ...P17_ITEMS,
  ...P18_ITEMS,
  ...P19_ITEMS,
  ...P20_ITEMS,
  ...A01_ITEMS,
  ...A02_ITEMS,
  ...A03_ITEMS,
  ...A04_ITEMS,
  ...A05_ITEMS,
  ...A06_ITEMS,
  ...A07_ITEMS,
  ...A08_ITEMS,
  ...A09_ITEMS,
  ...A10_ITEMS,
  ...A11_ITEMS,
  ...A12_ITEMS,
  ...A13_ITEMS,
  ...A14_ITEMS,
  ...A15_ITEMS,
  ...A16_ITEMS,
  ...A17_ITEMS,
  ...A18_ITEMS,
  ...A19_ITEMS,
  ...A20_ITEMS,
  ...I01_ITEMS,
  ...I02_ITEMS,
  ...I03_ITEMS,
  ...I04_ITEMS,
  ...I05_ITEMS,
  ...I06_ITEMS,
  ...I07_ITEMS,
  ...I08_ITEMS,
  ...I09_ITEMS,
  ...I10_ITEMS,
  ...I11_ITEMS,
  ...I12_ITEMS,
  ...I13_ITEMS,
  ...I14_ITEMS,
  ...I15_ITEMS,
  ...I16_ITEMS,
  ...I17_ITEMS,
  ...I18_ITEMS,
  ...I19_ITEMS,
  ...I20_ITEMS,
  ...B01_ITEMS,
  ...B02_ITEMS,
  ...B03_ITEMS,
  ...B04_ITEMS,
  ...B05_ITEMS,
  ...B06_ITEMS,
  ...B07_ITEMS,
  ...B08_ITEMS,
  ...B09_ITEMS,
  ...B10_ITEMS,
  ...B11_ITEMS,
  ...B12_ITEMS,
  ...B13_ITEMS,
  ...B14_ITEMS,
  ...B15_ITEMS,
  ...B16_ITEMS,
  ...B17_ITEMS,
  ...B18_ITEMS,
  ...B19_ITEMS,
  ...B20_ITEMS,
  ...L01_ITEMS,
  ...L02_ITEMS,
  ...L03_ITEMS,
  ...L04_ITEMS,
  ...L05_ITEMS,
  ...L06_ITEMS,
  ...L07_ITEMS,
  ...L08_ITEMS,
  ...L09_ITEMS,
  ...L10_ITEMS,
  ...L11_ITEMS,
  ...L12_ITEMS,
  ...L13_ITEMS,
  ...L14_ITEMS,
  ...L15_ITEMS,
  ...L16_ITEMS,
  ...L17_ITEMS,
  ...L18_ITEMS,
  ...L19_ITEMS,
  ...L20_ITEMS,
  ...R01_ITEMS,
  ...R02_ITEMS,
  ...R03_ITEMS,
  ...R04_ITEMS,
  ...R05_ITEMS,
  ...R06_ITEMS,
  ...R07_ITEMS,
  ...R08_ITEMS,
  ...R09_ITEMS,
  ...R10_ITEMS,
  ...R11_ITEMS,
  ...R12_ITEMS,
  ...R13_ITEMS,
  ...R14_ITEMS,
  ...R15_ITEMS,
  ...R16_ITEMS,
  ...R17_ITEMS,
  ...R18_ITEMS,
  ...R19_ITEMS,
  ...R20_ITEMS,
  ...E01_ITEMS,
  ...E02_ITEMS,
  ...E03_ITEMS,
  ...E04_ITEMS,
  ...E05_ITEMS,
  ...E06_ITEMS,
  ...E07_ITEMS,
  ...E08_ITEMS,
  ...E09_ITEMS,
  ...E10_ITEMS,
  ...E11_ITEMS,
  ...E12_ITEMS,
  ...E13_ITEMS,
  ...E14_ITEMS,
  ...E15_ITEMS,
  ...E16_ITEMS,
  ...E17_ITEMS,
  ...E18_ITEMS,
  ...E19_ITEMS,
  ...E20_ITEMS,
  ...X01_ITEMS,
  ...X02_ITEMS,
  ...X03_ITEMS,
  ...X04_ITEMS,
  ...X05_ITEMS,
  ...X06_ITEMS,
  ...X07_ITEMS,
  ...X08_ITEMS,
  ...X09_ITEMS,
  ...X10_ITEMS,
  ...X11_ITEMS,
  ...X12_ITEMS,
  ...X13_ITEMS,
  ...X14_ITEMS,
  ...X15_ITEMS,
  ...X16_ITEMS,
  ...X17_ITEMS,
  ...X18_ITEMS,
  ...X19_ITEMS,
  ...X20_ITEMS,
  ...M01_ITEMS,
  ...M02_ITEMS,
  ...M03_ITEMS,
  ...M04_ITEMS,
  ...M05_ITEMS,
  ...M06_ITEMS,
  ...M07_ITEMS,
  ...M08_ITEMS,
  ...M09_ITEMS,
  ...M10_ITEMS,
  ...M11_ITEMS,
  ...M12_ITEMS,
  ...M13_ITEMS,
  ...M14_ITEMS,
  ...M15_ITEMS,
  ...M16_ITEMS,
  ...M17_ITEMS,
  ...M18_ITEMS,
  ...M19_ITEMS,
  ...M20_ITEMS,
};

export const NUOVI_BANKS = Object.fromEntries(
  Object.entries(NUOVI_BANK_ITEMS).map(([id, items]) => [id, makeBank(id, items)]),
);
