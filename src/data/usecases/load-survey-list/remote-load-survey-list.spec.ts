import faker from 'faker'
import { HttpGetClientSpy } from 'data/test'
import { RemoteLoadSurveyList } from './remote-load-survey-list'

describe('RemoteLoadSurveyList', () => {
  test('should call HttpGetClient with correct URL', () => {
    const url = faker.internet.url()
    const httpGetClientSpy = new HttpGetClientSpy()
    const sut = new RemoteLoadSurveyList(url, httpGetClientSpy)
    sut.loadAll()
    expect(httpGetClientSpy.url).toBe(url)
  })
})
