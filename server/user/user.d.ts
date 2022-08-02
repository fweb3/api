export interface IUserVerifyRequest {
  network: string
  account: string
  ipinfo: IIpinfoResponse
}

export interface IIpinfoResponse {
  ip: string
  hostname: string
  city: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
}
