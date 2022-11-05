import { Course, Department } from './mongodb.js';

const courses = [
  '소프트웨어공학개론',
  '데이터베이스프로그래밍',
  '웹프로그래밍',
  '암호학과네트워크보안',
  '데이터통신입문',
  '컴퓨터알고리즘과실습',
];

const CSE = await Department.findOne({ name: '컴퓨터공학과' }).exec();

console.log(CSE);

courses.forEach((course) => {
  console.log(course);
  const newCourse = new Course({
    parent: CSE._id,
    name: course,
  });

  newCourse.save();
});
