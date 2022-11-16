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

export interface Answer {
  _id: string;
  writer: string;
  content: string;
  createdAt: string;
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

export interface Recommendation {
  _id: string;
  from: string;
  answer: string;
}

export interface WithAnswers {
  answers: Answer[];
}

export interface WithQuestion {
  question: Question;
}

export interface WithRecommendations {
  recommendations: Recommendation[];
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

export interface QuestionPaginator {
  cntQuestions: number;
  questionList: (Question & WithAnswers)[];
}

export interface AnswerPaginator {
  cntAnswers: number;
  answerList: (Answer & WithQuestion)[];
}

const createApiRequester = (axios: AxiosInstance) => ({
  auth: {
    login(data: Credentials) {
      return axios
        .post<{
          token: string;
        }>('/auth/login', data)
        .then(response => response.data);
    },
    register(data: Credentials) {
      return axios.post<void>('/auth/signup', data).then(response => response.data);
    },
    verify(data: { signupToken: string }) {
      return axios.post<void>('/auth/verifyUser', data).then(response => response.data);
    },
    me() {
      return axios.get<User>('/auth/me').then(response => response.data);
    },
    find: {
      send(data: { email: string }) {
        return axios.post<void>('/users/find-password', data).then(response => response.data);
      },
      reset(data: { userToken: string; password: string }) {
        return axios.put<void>('/users/reset-password', data).then(response => response.data);
      },
    },
  },
  category: {
    departments() {
      return axios.get<Department[]>('/departments').then(response => response.data);
    },
    courses() {
      return axios.get<Course[]>('/courses').then(response => response.data);
    },
  },
  questions: {
    index(type: 'department' | 'course', name: string, page: number = 1) {
      return axios.get<QuestionPaginator>(`/questions/${type}/${name}?page=${page}`).then(response => response.data);
    },
    me(page: number = 1, perPage: number = 10) {
      return axios.get<QuestionPaginator>(`/questions/me?page=${page}&perPage=${perPage}`).then(response => response.data);
    },
    write(data: { title: string; content: string; courseName: string }) {
      return axios.post<Question>('/questions', data).then(response => response.data);
    },
    show(id: string) {
      return axios
        .get<{
          question: Question;
          answers: (Answer & WithRecommendations)[];
        }>(`/questions/${id}`)
        .then(response => response.data);
    },
  },
  answers: {
    write(questionId: string, data: { content: string }) {
      return axios.post<Answer>(`/questions/${questionId}/answers`, data).then(response => response.data);
    },
    me(page: number = 1, perPage: number = 10) {
      return axios.get<AnswerPaginator>(`/answers/me?page=${page}&perPage=${perPage}`).then(response => response.data);
    },
    like(id: string) {
      return axios.post<void>(`/answers/${id}/recommend`).then(response => response.data);
    },
  },
  point: {
    todayPoint() {
      return axios.get<{ value: number }>(`/points/today`).then(response => response.data);
    },
  },
});

export const useApi = () => {
  const { $axios } = useNuxtApp();

  const api = createApiRequester($axios);

  return api;
};
