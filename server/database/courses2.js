import { Course, Department } from './mongodb.js';

const courses_CSE = [
  '이산구조',
  '어드벤처디자인',
  '자료구조와실습',
  '프로그래밍언어개념',
  '기초프로그래밍',
  '심화프로그래밍',
  '객체지향프로그래밍',
  '모바일컴퓨팅',
  '컴퓨터공학종합설계1',
  '임베디드소프트웨어입문',
  'SW비즈니스와창업',
  '테크니컬프리젠테이션',
  '바이오인포매틱스알고리즘',
  '머신러닝',
  '컴퓨터구성',
  '형식언어',
  '운영체제',
  '데이터베이스시스템',
  '컴퓨터네트워킹',
  '컴퓨터보안',
  '객체지향설계와패턴',
  '컴퓨터그래픽스입문',
  'S/W품질관리및테스팅',
  '인간컴퓨터상호작용시스템',
  '데이터분석및실습',
];

const courses_INC = [
  '객체지향언어와실습',
  '네트워크보안',
  '데이터베이스체제',
  '디지털영상처리',
  '디지털통신및실험',
  '멘토프로그램',
  '모바일소프트웨어',
  '산학융합종합설계',
  '신호와시스템',
  '어드벤처디자인',
  '임베디드시스템',
  '정보통신프로그래밍',
  '캡스톤디자인',
  '컴퓨터구성',
  '컴퓨터네트워크',
  '컴퓨터알고리즘및실습',
  '확률및랜덤프로세스',
];

const CSE = await Department.findOne({ name: '컴퓨터공학전공' }).exec();

courses_CSE.forEach((course) => {
  console.log(course);
  const newCourse = new Course({
    parent: CSE._id,
    name: course,
  });

  newCourse.save();
});

const INC = await Department.findOne({ name: '정보통신공학전공' }).exec();

courses_INC.forEach((course) => {
  console.log(course);
  const newCourse = new Course({
    parent: INC._id,
    name: course,
  });

  newCourse.save();
});
