import departments from './departments.json';
import courses from './courses.json';
import questions from './questions.json';

export interface Category {
  parent: {
    id: number;
    name: string;
  };
  id: number;
  name: string;
}

export const fakeAxiosCategory = (url: string, data: { type: string; id: number }) => {
  if (url === '/category') {
    if (data.type === 'department') {
      return departments.find(d => d.id === data.id);
    } else {
      return courses.find(c => c.id === data.id);
    }
  }
};

export const fakeAxiosQuestions = (data: { type: string; id: number }) => {
  if (data.type === 'department') {
    return questions.filter(q => q.course.parent.id === data.id);
  } else {
    return questions.filter(q => q.course.id === data.id);
  }
};

export { departments, courses, questions };
