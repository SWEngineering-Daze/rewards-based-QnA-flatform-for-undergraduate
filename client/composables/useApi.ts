import { AxiosInstance } from 'axios';

export interface Department {
  parent: {
    id: number;
    name: string;
  };
  _id: string;
  name: string;
}

export interface Course {
  parent: Department;
  _id: string;
  name: string;
}

export interface Recommendation {
  from: string;
  answer: string;
}

export interface Answer {
  _id: string;
  writer: string;
  content: string;
  createdAt: string;
  fileIds: string[];
  fileNames: string[];
  recommendations?: Recommendation[];
  [key: string]: any;
}

export interface Question {
  _id: string;
  course: Course;
  writer: string;
  title: string;
  content: string;
  createdAt: string;
  answers?: Answer[];
  fileIds: string[];
  fileNames: string[];
  cntAnswers?: number;
  [key: string]: any;
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
  accumulatedExp: number;
  point: number;
  level: number;
  [key: string]: any;
}

export interface QuestionPaginator {
  cntQuestions: number;
  questionList: Question[];
}

export interface AnswerPaginator {
  cntAnswers: number;
  answerList: (Answer & WithQuestion)[];
}

export interface ShopItem {
  _id: string;
  name: string;
  url: string;
  price: number;
}

export interface ShopPartner {
  _id: string;
  name: string;
  url: string;
  items: ShopItem[];
}

export interface Coupon {
  _id: string;
  serialNumber: string;
  user: User;
  item: ShopItem;
  createdAt: string;
}

export interface History {
  _id: string;
  user: User;
  content: string;
  amount: number;
  createdAt: string;
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
    index(type: 'department' | 'course', name: string, page: number = 1, query: string = null) {
      return axios.get<QuestionPaginator>(`/questions/${type}/${name}?page=${page}${query ? `&query=${query}` : ''}`).then(response => response.data);
    },
    me(page: number = 1, perPage: number = 10) {
      return axios.get<QuestionPaginator>(`/questions/me?page=${page}&perPage=${perPage}`).then(response => response.data);
    },
    write(data: { title: string; content: string; courseName: string }, files: File[]) {
      const formData = new FormData();
      formData.set('information', JSON.stringify(data));
      files.forEach(f => formData.append('attachment', f));

      return axios.post<Question>('/questions', formData).then(response => response.data);
    },
    update(id: string, data: { title: string; content: string; filesToDelete: string[] }, newFiles: File[]) {
      const formData = new FormData();
      formData.set('information', JSON.stringify(data));
      newFiles.forEach(f => formData.append('attachment', f));

      return axios.put<void>(`/questions/${id}`, formData).then(response => response.data);
    },
    show(id: string) {
      return axios
        .get<{
          question: Question;
          answers: (Answer & WithRecommendations)[];
        }>(`/questions/${id}`)
        .then(response => response.data);
    },
    remove(id: string) {
      return axios.delete<void>(`/questions/${id}`).then(response => response.data);
    },
    best() {
      return axios.get<Question[]>(`/questions/best`).then(response => response.data);
    },
    new() {
      return axios.get<Question[]>(`/questions/new`).then(response => response.data);
    },
    old() {
      return axios.get<Question[]>(`/questions/old`).then(response => response.data);
    },
  },
  answers: {
    write(questionId: string, data: { content: string }, files: File[]) {
      const formData = new FormData();
      formData.set('information', JSON.stringify(data));
      files.forEach(f => formData.append('attachment', f));

      return axios.post<Answer>(`/questions/${questionId}/answers`, formData).then(response => response.data);
    },
    update(id: string, data: { content: string; filesToDelete: string[] }, newFiles: File[]) {
      const formData = new FormData();
      formData.set('information', JSON.stringify(data));
      newFiles.forEach(f => formData.append('attachment', f));

      return axios.put<void>(`/answers/${id}`, formData).then(response => response.data);
    },
    me(page: number = 1, perPage: number = 10) {
      return axios.get<AnswerPaginator>(`/answers/me?page=${page}&perPage=${perPage}`).then(response => response.data);
    },
    like(id: string) {
      return axios.post<void>(`/answers/${id}/recommend`).then(response => response.data);
    },
    remove(id: string) {
      return axios.delete<void>(`/answers/${id}`).then(response => response.data);
    },
  },
  files: {
    download(id: string) {
      return axios.get(`/files/${id}`, { responseType: 'blob' }).then(response => response.data);
    },
  },
  point: {
    todayPoint() {
      return axios.get<{ value: number }>(`/points/today`).then(response => response.data);
    },
  },
  items: {
    index() {
      return axios.get<ShopPartner[]>(`/items`).then(response => response.data);
    },
    exchange(id: string) {
      return axios.post<Coupon>(`/items/${id}`).then(response => response.data);
    },
  },
  histories: {
    index() {
      return axios.get<History[]>(`/histories`).then(response => response.data);
    },
  },
  coupons: {
    index() {
      return axios.get<Coupon[]>(`/coupons`).then(response => response.data);
    },
    show(id: string) {
      return axios.get<Coupon>(`/coupons/${id}`).then(response => response.data[0]);
    },
  },
});

export const useApi = () => {
  const { $axios } = useNuxtApp();

  const api = createApiRequester($axios);

  return api;
};
