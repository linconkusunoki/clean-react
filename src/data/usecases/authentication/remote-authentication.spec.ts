import faker from 'faker'
import { HttpPostClientSpy } from 'data/test/mock-http-client'
import { RemoteAuthentication } from './remote-authentication'

type SutTypes = {
  sut: RemoteAuthentication
  httpPostClientSpy: HttpPostClientSpy
}

const makeSut = (url = faker.internet.url()): SutTypes => {
  const httpPostClientSpy = new HttpPostClientSpy()
  const sut = new RemoteAuthentication(url, httpPostClientSpy)
  return {
    sut,
    httpPostClientSpy
  }
}

describe('RemoteAuthentication', () => {
  test('should call HttpPostClient with correct URL', () => {
    const url = faker.internet.url()
    const { sut, httpPostClientSpy } = makeSut(url)
    sut.auth()
    expect(httpPostClientSpy.url).toBe(url)
  })
})
