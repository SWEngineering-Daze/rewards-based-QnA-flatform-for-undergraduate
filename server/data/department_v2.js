import { Department } from './mongodb.js';

const depts = [
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '컴퓨터공학전공',
  },
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '전자전기공학부',
  },
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '정보통신공학전공',
  },
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '건설환경공학과',
  },
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '화공생물공학과',
  },
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '기계로봇에너지공학과',
  },
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '건축공학전공',
  },
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '건축학전공',
  },
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '산업시스템공학과',
  },
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '멀티미디어공학과',
  },
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '융합에너지신소재공학과',
  },
  {
    parent: {
      id: 2,
      name: '불교대학',
    },
    name: '불교학부',
  },
  {
    parent: {
      id: 2,
      name: '불교대학',
    },
    name: '문화재학과',
  },
  {
    parent: {
      id: 3,
      name: '문과대학',
    },
    name: '국어국문문예창작학부',
  },
  {
    parent: {
      id: 3,
      name: '문과대학',
    },
    name: '영어영문학전공',
  },
  {
    parent: {
      id: 3,
      name: '문과대학',
    },
    name: '영어통번역학전공',
  },
  {
    parent: {
      id: 3,
      name: '문과대학',
    },
    name: '일본학과',
  },
  {
    parent: {
      id: 3,
      name: '문과대학',
    },
    name: '중어중문학과',
  },
  {
    parent: {
      id: 3,
      name: '문과대학',
    },
    name: '철학과',
  },
  {
    parent: {
      id: 3,
      name: '문과대학',
    },
    name: '사학과',
  },
  {
    parent: {
      id: 3,
      name: '문과대학',
    },
    name: '윤리문화학과',
  },
  {
    parent: {
      id: 4,
      name: '이과대학',
    },
    name: '수학과',
  },
  {
    parent: {
      id: 4,
      name: '이과대학',
    },
    name: '화학과',
  },
  {
    parent: {
      id: 4,
      name: '이과대학',
    },
    name: '통계학과',
  },
  {
    parent: {
      id: 4,
      name: '이과대학',
    },
    name: '물리반도체과학부',
  },
  {
    parent: {
      id: 5,
      name: '법과대학',
    },
    name: '법학과',
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
    name: '정치외교학전공',
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
    name: '행정학전공',
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
    name: '북한학전공',
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
    name: '경제학과',
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
    name: '국제통상학과',
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
    name: '사회학전공',
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
    name: '미디어커뮤니케이션학전공',
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
    name: '식품산업관리학과',
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
    name: '광고홍보학과',
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
    name: '사회복지학과',
  },
  {
    parent: {
      id: 7,
      name: '경찰사법대학',
    },
    name: '경찰행정학부',
  },
  {
    parent: {
      id: 8,
      name: '경영대학',
    },
    name: '경영학과',
  },
  {
    parent: {
      id: 8,
      name: '경영대학',
    },
    name: '회계학과',
  },
  {
    parent: {
      id: 8,
      name: '경영대학',
    },
    name: '경영정보학과',
  },
  {
    parent: {
      id: 9,
      name: '바이오시스템대학',
    },
    name: '바이오환경과학과',
  },
  {
    parent: {
      id: 9,
      name: '바이오시스템대학',
    },
    name: '생명과학과',
  },
  {
    parent: {
      id: 9,
      name: '바이오시스템대학',
    },
    name: '식품생명공학과',
  },
  {
    parent: {
      id: 9,
      name: '바이오시스템대학',
    },
    name: '의생명공학과',
  },
  {
    parent: {
      id: 10,
      name: '사범대학',
    },
    name: '교육학과',
  },
  {
    parent: {
      id: 10,
      name: '사범대학',
    },
    name: '국어교욱과',
  },
  {
    parent: {
      id: 10,
      name: '사범대학',
    },
    name: '역사교육과',
  },
  {
    parent: {
      id: 10,
      name: '사범대학',
    },
    name: '지리교육과',
  },
  {
    parent: {
      id: 10,
      name: '사범대학',
    },
    name: '수학교육과',
  },
  {
    parent: {
      id: 10,
      name: '사범대학',
    },
    name: '가정교육과',
  },
  {
    parent: {
      id: 10,
      name: '사범대학',
    },
    name: '체육교육과',
  },
  {
    parent: {
      id: 11,
      name: '약학대학',
    },
    name: '약학과',
  },
];

for (let element of depts) {
  console.log(element);

  const newDept = new Department(element);

  (async () => {
    await newDept.save();
  })();
}
