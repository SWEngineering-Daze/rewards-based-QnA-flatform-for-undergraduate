const depts = [
  {
    parent: {
      id: 1,
      name: '공과대학',
    },
    name: '컴퓨터공학과',
  },
  {
    parent: {
      id: 2,
      name: '불교대학',
    },
  },
  {
    parent: {
      id: 3,
      name: '문과대학',
    },
  },
  {
    parent: {
      id: 4,
      name: '이과대학',
    },
  },
  {
    parent: {
      id: 5,
      name: '법과대학',
    },
  },
  {
    parent: {
      id: 6,
      name: '사회과학대학',
    },
  },
  {
    parent: {
      id: 7,
      name: '경찰사법대학',
    },
  },
  {
    parent: {
      id: 8,
      name: '경영대학',
    },
  },
  {
    parent: {
      id: 9,
      name: '바이오시스템대학',
    },
  },
  {
    parent: {
      id: 10,
      name: '사범대학',
    },
  },
  {
    parent: {
      id: 11,
      name: '약학대학',
    },
  },
];

for (let element of depts) {
  console.log(element);

  const newDept = new Department(element);

  (async () => {
    await newDept.save();
  })();
}
