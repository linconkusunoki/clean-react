export type SurveyModel = {
  id: string
  question: string
  answer: [
    {
      image?: string
      answer: string
    }
  ]
  date: Date
  didAnswer: boolean
}
