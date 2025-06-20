export interface Position {
  id: string;
  name: string;
  divisionId: string;
}

export interface Division {
  id: string;
  name: string;
  departmentId: string;
}

export interface Department {
  id: string;
  name: string;
  companyId: string;
}

export interface Company {
  id: string;
  name: string;
}

export interface RatingSession {
  id: string;
  name: string;
  rating_process: "ACTIVE" | "END";
}

export const companies: Company[] = [
  { id: "comp1", name: "А Компани" },
  { id: "comp2", name: "Б Компани" },
];

export const departments: Department[] = [
  { id: "dept1", name: "Санхүүгийн Хэлтэс", companyId: "comp1" },
  { id: "dept2", name: "Хүний Нөөцийн Хэлтэс", companyId: "comp1" },
  { id: "dept3", name: "Маркетингийн Хэлтэс", companyId: "comp2" },
  { id: "dept4", name: "Технологийн Хэлтэс", companyId: "comp2" },
];

export const divisions: Division[] = [
  { id: "div1", name: "Нягтлан Бодох Алба", departmentId: "dept1" },
  { id: "div2", name: "Татварын Алба", departmentId: "dept1" },
  { id: "div3", name: "Ажилтны Удирдлагын Алба", departmentId: "dept2" },
  { id: "div4", name: "Сургалтын Алба", departmentId: "dept2" },
  { id: "div5", name: "Зах Зээлийн Судалгааны Алба", departmentId: "dept3" },
  { id: "div6", name: "Брэндийн Алба", departmentId: "dept3" },
  { id: "div7", name: "Програм Хангамжийн Алба", departmentId: "dept4" },
  { id: "div8", name: "Системийн Алба", departmentId: "dept4" },
];

export const positions: Position[] = [
  { id: "pos1", name: "Ерөнхий Нягтлан Бодогч", divisionId: "div1" },
  { id: "pos2", name: "Санхүүгийн Шинжээч", divisionId: "div1" },
  { id: "pos3", name: "Татварын Мэргэжилтэн", divisionId: "div2" },
  { id: "pos4", name: "Татварын Зөвлөх", divisionId: "div2" },
  { id: "pos5", name: "Хүний Нөөцийн Менежер", divisionId: "div3" },
  { id: "pos6", name: "Ажилтны Хөгжлийн Мэргэжилтэн", divisionId: "div3" },
  { id: "pos7", name: "Сургалтын Зохицуулагч", divisionId: "div4" },
  { id: "pos8", name: "Сургалтын Хөтөлбөр Хөгжүүлэгч", divisionId: "div4" },
  { id: "pos9", name: "Зах Зээлийн Судлаач", divisionId: "div5" },
  { id: "pos10", name: "Судалгааны Аналитик", divisionId: "div5" },
  { id: "pos11", name: "Брэндийн Менежер", divisionId: "div6" },
  { id: "pos12", name: "Контент Хөгжүүлэгч", divisionId: "div6" },
  { id: "pos13", name: "Програм Хангамжийн Инженер", divisionId: "div7" },
  { id: "pos14", name: "Тестерийн Инженер", divisionId: "div7" },
  { id: "pos15", name: "Системийн Админ", divisionId: "div8" },
  {
    id: "pos16",
    name: "Мэдээллийн Аюулгүй Байдлын Мэргэжилтэн",
    divisionId: "div8",
  },
];

export const ratingSessions: RatingSession[] = [
  {
    id: "rs1",
    name: "2025 Q1 Үнэлгээ",
    rating_process: "ACTIVE",
  },
  {
    id: "rs2",
    name: "2024 Q4 Үнэлгээ",
    rating_process: "END",
  },
];
