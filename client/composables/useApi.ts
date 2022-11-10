import { AxiosInstance } from 'axios';

export interface Department {
  parent: {
    id: number;
    name: string;
  };
  _id: string;
  name: string;
  [key: string]: any;
}

export interface Course {
  parent: Department;
  _id: string;
  name: string;
  [key: string]: any;
}

export interface Question {
  _id: string;
  course: Course;
  writer: string;
  title: string;
  content: string;
  createdAt: string;
  [key: string]: any;
}

export interface Answer {
  _id: string;
  writer: string;
  content: string;
  createdAt: string;
  [key: string]: any;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  [key: string]: any;
}

const createApiRequester = (axios: AxiosInstance) => ({
  auth: {
    login(data: Credentials) {
      return axios.post<{
        token: string;
      }>('/auth/login', data);
    },
    register(data: Credentials) {
      return axios.post<void>('/auth/signup', data);
    },
    verify(data: { signupToken: string }) {
      return axios.post<void>('/auth/verifyUser', data);
    },
    me() {
      return axios.get<User>('/auth/me');
    },
  },
  category: {
    departments() {
      return axios.get<Department[]>('/departments');
    },
    courses() {
      return axios.get<Course[]>('/courses');
    },
  },
  questions: {
    index(type: 'department' | 'course', name: string, page: number = 1) {
      return axios.get<{
        cntQuestions: number;
        questionList: Question[];
      }>(`/questions/${type}/${name}?page=${page}`);
    },
    write(data: { title: string; content: string; courseName: string }) {
      return axios.post<Question>('/questions', data);
    },
    show(id: string) {
      return axios.get<{
        question: Question;
        answers: Answer[];
      }>(`/questions/${id}`);
    },
  },
  answers: {
    write(questionId: string, data: { content: string }) {
      return axios.post<Answer>(`/questions/${questionId}/answers`, data);
    },
  },
});

export const useApi = () => {
  const { $axios } = useNuxtApp();

  const api = createApiRequester($axios);

  return api;
};
