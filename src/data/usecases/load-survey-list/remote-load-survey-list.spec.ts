import faker from 'faker'
import { HttpGetClientSpy, HttpPostClientSpy } from 'data/test'
import { RemoteLoadSurveyList } from './remote-load-survey-list'
import { HttpStatusCode } from 'data/protocols/http'
import { UnexpectedError } from 'domain/errors'
import { SurveyModel } from 'domain/models'

type SutTypes = {
  sut: RemoteLoadSurveyList
  httpGetClientSpy: HttpGetClientSpy<SurveyModel[]>
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpGetClientSpy = new HttpGetClientSpy<SurveyModel[]>()
  const sut = new RemoteLoadSurveyList(url, httpGetClientSpy)

  return {
    sut,
    httpGetClientSpy
  }
}

describe('RemoteLoadSurveyList', () => {
  test('should call HttpGetClient with correct URL', () => {
    const url = faker.internet.url()
    const { sut, httpGetClientSpy } = makeSut(url)
    sut.loadAll()
    expect(httpGetClientSpy.url).toBe(url)
  })

  test('should throw UnexpectedError if HttpGetClient return 403', () => {
    const { sut, httpGetClientSpy } = makeSut()
    httpGetClientSpy.response = {
      statusCode: HttpStatusCode.forbidden
    }
    const promise = sut.loadAll()
    expect(promise).rejects.toThrow(new UnexpectedError())
  })
})
