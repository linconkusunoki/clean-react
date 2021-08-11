export type SurveyModel = {
  id: string
  question: string
  answer: SurveyAnswerModel[]
  date: Date
  didAnswer: boolean
}

export type SurveyAnswerModel = {
  image?: string
  answer: string
}
