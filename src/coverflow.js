import Logger from './logger'
import Style from './style'
import Signal from './signal'
import Validator from './validator'

const MEDIAN = 3
const STARTING_FRAME = MEDIAN
const TOUCH_MOVE_STEP = 70
const TEMPLATE_ATT = 'data-template'
const ZOOM_ATT = 'data-zoom-url'
const DESC_ATT = 'data-description'
const ID_ATT = 'data-id'
const PAGE_SIZE = 7
const CLICK = 'click'
const TAP_THRESHOLD_DURATION = 100
const GHOST_FRAME_ATT = 'data-ghost-frame'

const LARGE_URL_PROPS = [
  'url_w',
  'url_n',
  'url_m'
]

const ZOOM_URL_PROPS = [
  'url_b',
  'url_c',
  'url_z',
  ...LARGE_URL_PROPS
]

function getLargeUrl (rawImage) {
  const urlProperty = LARGE_URL_PROPS.find(property => rawImage[property])
  return rawImage[urlProperty]
}

function getZoomUrl (rawImage) {
  const urlProperty = ZOOM_URL_PROPS.find(property => rawImage[property])
  return rawImage[urlProperty]
}

function getDescription (rawImage) {
  return rawImage.description?._content
}

/* Flickr Coverflow 2.1.1 */
export default class Coverflow {
  static #CLASS_ID = '[flickr-coverflow/Coverflow]'

  static #placeholder = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARcAAAEXCAMAAACwDfDmAAAAeFBMVEXp7vG6vsDY3d/////l6ezo7O+9wcPm6+7Cxsi/w8XW293j5+rc4OPa3uHHy83e4uXQ1dfP09XKztHU2NvS19nN0dTEyMr8/PzFyszM0NLf5OfJzc/W2dvh5ung5ej5+fr19vfz9PXw8vPo6ers7e7v8PHk5ube4OGosjzeAAAgXUlEQVR42uzWSw7CMAyE4QmyoYVGBVo2lej9j8kWlLC0ZMT/HWE0fggAAAAAAORlQsdGLj12Flp+d6G1UpeebaAuHT5WBfrZzG+xdfH8p87VMZeqUJY+GHM1fAjfLlP2UfJZjaUcFMzTn7vL1FToOLqi7VXJ1V2fHmVRvPWp5K6md1aOJ331Rw/1ixk73XUUhqEAfE4VJ1DCDhVLy/s/5oilwA1w1VFnEN+vVi2QOLYhqJ8jTFniDE2Ni7MlFqLZ4BTp5XvveoQhPZxDvAbXJl6Mt4wJThJ7BtfW6AATzQZnKVtcXPFeuoBa8M8Jdhk/x7VJ1crUXh74ksFGh32WMa5I8BboBL2cNb50N3DZAPtK/5I7yACzO8Px6SXFl9IQru6Jo0qKrvh4Z7HIdAeg/j4ubQ2XinAgZIHreQpmyvcVkLHEl7xt5xZtcCCjxeWEFgvLSpCxxZfIBi7/hgNK6+u1GFW6O6OaHr6jyASuR4YjISvBX1Ad/r/KYCEenwkp2FCCj8XcCW2rBUdapuLe5I+9TtmHFzlWXmRNxtiIG3zsTlLBUdLiiNKrHzv8zuoOJwi0cefEAhu2wKeUT/IOR8ESR0zGeRsiIX6VM8UposTJadLDRljhQ1KRZLtNIv84LCpihZHt8Aup6QtOYXWwWe3Xkk4NBjcKPlOzV8NhyQa7JLJQ+l28qfzS09SDtDhJ9BCnay6pGnqCwf3T8RTsPQSOjkwOwpIM58+mb5hZOBqfrHGWl1OxKTn1HFPz9pdlHbKnFVyK1DG2pB1iKHps1XG2HBHunFsrnCZhjhXxyAJQNvfpyZwGHj7QcBBjQ7jXjSGZDtZvw9JiGZbBmiQkecN5pGLuVJKuNHt2iR0VZkaObm5cpu/wSTIV/CBzRt7GhupbTFSGNdOSZIQzKc3MYJGxp9u8WRfXbQmcwi7jsZdiz4O9yGCtZIaRIUOgW6Kf3LESDKfWAf47ozB7+fQsZgHJZ4C1eul4JlfYJRF7lWDPjQPvhUVK37xzr2UFJBoT0evxlZq9HCdoGswCn8zUsozzEMySQhqDpjTYl7LnK+x7cqAtVsXZAKG849bBqzDJ509yqzh6CM4Q3jFTFckyWBJGC3oxRhHJDoAUtWBfzJ7ucCThKF+uUgCQUqZCKoO5BsXPpz8lmm8dznFfzVEKkqybOQz5j1eS1TgfVaWCA0YPa4pjJUfTZcvp2bX7w7uZLikKQ1H4Xis3C4QtLIXQ+P6POdVJnCyC6Djl90/bwuJ410O6JvedvMUCHAWWdimoMdDCt+hlGZ+os/dllbjcA6YpQtWcqOJRhtP+bTM4hFZ0zMyFyw9Y+pruq9niPymlkyrCEHyNgVfxkRQXsutFsHu4iznkEcpkfBD7w8vP6e7ki9AVOd0Ldi3s5IdIsbm5YMQPfJMWW4pu9Z7MM94DRm7RPScWNdtvxV7Iw07uqFx18TDJK6u9BIfELQ0XtcB3GX+DOiAGnv5Cpo1nmis9OyJXuEQ6MSEsK5n4NAmNaNjwdw3XKNNwqRl8Gbr6zhmySaLFVcXhXhvRMkJggQzi2bR7PBLXJqmjAjTn9X2eFcr+JmuouARfh8zDeN5cwzyvUcPSKUT+IEwDOd3JrB4CTxpEc4slZuvfJDR2Nryhh2v4LmEhyw9ciEvtA4ahVFaP0gvTPTlSueEvAp7Roadr5rkisFz8fDP5Ca+MwmUq4UsQpDQKcWQ7xaIHKF052AB6dITNTkNOfb7zDugpAfSkemHfJGddSbet9b+Z+/32zCBDjIi8Td8ma9xZNabGv5EtKcW+/bKeuuLB0ask/5Xxot3ArKy2E0Xh0sDX2PZO6CCi0ZTtM9JOHAXFm58JY+H+csjpWYBqdGz37Yd3BMvoIoTbr92icOH0vf9F0PAI2Qat2i0NmOvvm8hNRc6wSlxxvew3m1z3jR6tKx4cTj6VQpFLWdj8WGPQYeBTlpfDZf+TzHeKdtmaS9+ZmaOjFHpY5TpoHzAUhp3dcXaGlKVJtMt1gVJxzRc38IrJeYQbegr4lP7tZ/U5m8EdFFjKRlfOWwqyjrslVWdXbVPxQtkN4y7y1v1l9FuzQQ+DT1kJXqOFiHNlTF4binCl8tFoyI3gsiZI4GipnEq30m5hNkrC1tygR8LHrPq1QksjHBKssUCR6zKG1wUEhAo3HGBy2TN6w3LUtG3VbBILq5jLoob/R29hvMIRSZLqk82ULivGbHmPnSLjIBtk/Y0FhBx2tsu0m9+K1kzImdVlSWRBDR/TcjqUjOIXDZxBuq0VR4d4KCDhapGNfdkrlDTn3mPYkleWGshX4adpjZbPu3Q4H3eAiaWQAl7E5Hkx5hHUVuBYrmHZDFDNy0PXDnlByTOJ3n2ZxsAKn1Md9/o6Sp1SvmHOZHugT7BLtGG6zJvQw5d0JS0gJc2SucxztIAKIyYGH9McR918jbq0eV3pfBKf8lQhRcAGFXp6Eh6d1/RYGBwIPGQv3leYwHeEFfAWJR4m0iSj2OnhVbbcWlB5vMBcXDHAWRpuksGZMKFd2cnfYE4dSy2a3tQ3eAtxnI4ylEp6o8RTXvww68RUKYxIzhay1T7EPBUGp+EWHIicUIao+blKRFwFvAk/tD5UyAX9zgQpUx1E3jwvGGMUJd7FACm5MAE1arIPWvaZdTFKdPTwNurQ+uDBTe8UvI5Ju8KW6UIKI4axjZ9G8eppikpM4WvBajxDNfA+46GHyMNxGrnC6wzpCNNklsgPRhQUejKrUW3wFOrwVT61v5vDNSvsGeXJqfNyryFhkabNEh4wRh5sI8Gj+dkd+E89hfeNC6CP7W+VT5tEQggmSmsWCEFEPydl95K3uNg56FNdBsR4bOm64Bd3BOcc5k3oQ0udSP+PtNF2QkKwP6yc57KiMBiG85FCQgBpUhRFsd3/He6kuCELWHZ8fqHnOE5evp7gE5UBY6JJ4UBfeg7xhGXeUCDzOibCXLKV7kgPaT8/1dTDGixQt1UpU/VRkMSbowzR/yJtsUFpSKYoB6uIQgIjhIR0VZsoWurxoO2VFp2zFy+tCqLHbtR4xzd7gwcOixRED9p+RasMw4kSovF8GoZmVL45nM4jSqC1f1pRJt7PDp1aRBfUU4uW4J+/qPY2mtZEXewIsnwffnmig5tEvyLSB1CIgt5ODbbclLtiRQT9jb5SZgfe2yUsk1ErmauH6wghWQN0Mq6KoiRf1gIOG5wOFfoZoUlmJBwHPOGq3tYqdXDBeBjDVWWI30scBSyTbibrMD5MzHkIBmz7jQfE4PPci21D9CtoaPa1Buyj8+uorrZwxorhtqIMhc5/HQh4Qyp0COX2P9OEoi9wsd2fg+2D31kLIVoBdsYeV1Dc1WUON2xoRhuC/oH925TTksErsl7HlxYUvCToW3LwqI0D/+wsHSUKvYa0wRMGAYpSXWfKj3xlqL/5xG0163eA6wh6gAptah1odv9XjnqUP3182CSh69CDIsATOtDs1XUFD6wZtWLo6UySuiljj2ZEDFbQ42qu3beQyPHfjqQFkaz4oSzhCeMRNNZbVKB5gIbvNxjjHnqsuNgQdAq1MHE4yczJ53WGriMP2h7fT0XoWsfkm2OoR1Tydz6EtPfUoOCNcZVLcwPD7STuKk93WJFhS4MIkRVxQ7AWFhdI6hVzkVsdFJL30a+iyLFaDDDdAGdvV/yxLCrYOvOo7LKf6eShwu8dB1DrSFziv5x3WykpOtKnUYerh7nnsPzTA8dyvZPcwQRhHhV4pwCV6C3aFwZsOIHhMg8uCVweAOqquDhdbhWRCQnlxo5Y2Nq3rLpSIuCtLgcRvxoLOjg6ev0V2a2I+ZG10ObfMMtO1nrcC1xAB3BSlnPCT+5V02wCQkhpRwn16tIYLCAi6mLSKhv2yjOEl6b3E/Mjhy1a5nh4ay02tFjuYOh0A2C4TzL2DZ9Zgi1Nrxwu2BAiC1tMFN90v6xSXhfZVuB/n5BuwdESgGSi5+ryq/fWcm2wo2FgeOCBg0Y0kwrvPtQdHqxQhU5P6flKCKemgc7Xv0rMdQFgPN0DCzZyfeWRe0DmbUJKS2DUyVLUxN7+ODh635CT17JYa3FkYBlzKwuvn36TABSdGHBz1iGXByYkDQ0i4kC1q0faZz4yGMaF/zLt8jKK+rKsqizL8jzfZn2yKZUFfKwLh85N9FrKxQGRJOfGybbR7ilOkr2PLR5XdzMNlxMXV2tMwhY3dyULe1jPa3BDeUAoOuqhNq3ksk+DT6Duo9wlUQ08rcV0rFnvt1UQS2eDr0jB0bqxeqLMLALQ4ou2bVNFUcXETFHpy3IubPA/CPBp8InDo7EtpKlgeuU+gY3UTCmWbklII9W2hWnyUWVqM7qL1lTukqBP/nGpjRkifhh3+dONlCL1npk38w2dfyp4GXMH/C8BeAhlGi20Nx1RAEB9ojrhh2hsQOLaxYQk4RaASr4aRevZQMBAgK3/ikDxbs+HgEdup8T+RGbOvn3lRWc84wweqV78g0GlBTHd0+MxwgZrLtCaKBMQwoHFjNO10rKFKdX0jhO7xk34zwfl27NgEXjs7PlQTVvKTj9OsNSHr+UqFXPxAilM2dqCrwB2x3g06emStqpXOI9Kqb1xp5RIAPZv7ojJmr3E0wixQ4Zs5wqe0G3ev4LDFG7OEyvSiDzNqQ4//6UGG1zm+J17jy13Bumo6r67tqkLboKrDke5tZtdPDsHRjKyugLpbKmAYH7UhkRmkyn6as6QIRQw78hItvz4UQCMrnnRCS8xwJSHez8H6C8AtfoXfiuz0dR+lc1V1dZMax2x19VQ8KDud7q3UD11ySYtlcnt9lbLzwa88tBqVRhA2su/+3f10imUeMVcrniZDibcsePCQejm6QYi0aLeBUCENT1j/vE4mrfhep4Wk2dKsqecu+lpNkFULVg4f/wg6vIMFB1BxzJlwPMoPpZar7m9wHbFXAa8zAUmeOI1vWkj70aMW2osysXrSUKUtS8L6ufpKKDW11ObJGTr3KYuUfL0yyRZ3VWfw63cdJOpiqVwUd4P12LZXEY9wXZdgCMDh7jjKbdarT5QZnTKrEW5DmJPQjekS+m8j3GUk1+jDkAYi+Io4y6TctTaIBCv9n8wg5V0ITLzpUMFZNFcjCCnIN+cXwkDrW8ylXJXuKnUren+8HZmW4rCQBhOYRLCIpvIItjSru//hjMGMMQCOoNMfxczF3I8zd+V2lJJ58pd+33D104gYLMW7w1Gvv1uSDNJSQihMoXe1kNhG3cvKm88IT6OXDTjT5mLJH8IUV9wlaQoz8gtXzJoqXJVI8TnbosgdPDBn91YVteeRT+0Mh3BI4xX2piIL/dow/mTwwpnO+Wao5Eq3B03F8UlAEgew7dPQSNqJj4K8kGD4pxTSplMNks2X04fhuWb175/ImQV6A0SNofNdF/sAO81TvogMVKU7EbM5bbRuMVyEzm1wsutybEwkMXW/XZ6T4iDl+8WsnS6Pfu9HGDPkP8fLQJsh7UbnW4/XFNDNNhKjJ8i78cTDdcBneJrbmD2gIciU5Ng1Lh8WNDGGYzgVLvwPhDr9S33ttI+fe05AEfeH5tLRyENX5p52S0mzpRPDWkxmtjZfuygAcP5znisu90JXewNJr9bUeWAOZkSN5Nd4EbG4phO/Wx4QD2VlsMhIV5n6k4nBDsCgMv1sQ/PjYNCOIApdWPBpso99Gtyp70uJm+uT30E/IhotJTn+t1eXjFaj3Hd4lMVaD0ZSbNX0hsDb0c9Qn0mTp9/winLND6emo67SVEdbRnN6FOayCIJ+k2P9EDpxKiEQlAVYUQigwP3+tBNuZzgdJn1PhO3hSkSkxJKjZLREiRfaBmxjRE1TON84yZf2myeXz4++61wieXQ4VXUFUAJmTJ7i4T1c+kJYiLLT52ro9LvoN0Jw0aikRkuaEwVCFWvioxI9qQpq05dVREJkxfglZoXLIAfM0Yi/awj5TCB45l3rpxCqNWM3UuzMeT7UcAE5WU4UQVRaz8N0gXVRoV8y7orkw9gkVgr7Y4Azk5mpImWoI4jXGYykI8pKNFRSd2H0oh73hfgol9VOR1zMHtUGlnw1VXUicNSvRUQyVARaLH1CKMIi5EfgTESNh2lzaXJYJTsuZrOWjvCHnMwmrKtz60C6TRkPhfpyacnz5YIgFRTFpOh6Spje4nwY1r/0lia7bg0aZ5XsrnZQ0Z0YRxvBLQx6anGngd6hyTgAAnhw51mCpjCJ0ZQwFgj8qnsZQ1piqvW1duckS545kASB89/pEJ6/eJCVAJstYI3GpldJIYc4J3RQtRW2wCrSMOluahHKLVns1112ODpXPqXTgaehNuUA1cJxsghmuofb4BW8CJ2lW3icLSaNMpcJgNS8B6OXh4m6OpGtd5ZBhG6VCkFjUQKZkqibCzaTm+E2yrbXUua4fedsC4U1dLM7lK6jHbD365aMZz2npopR4wszhiV+JTzz32oC+4Bw13Xhc4aciIXiyyLAiK8LlH3VdIe93HZUTdaaGzJvxDpgVCxOH3B5C/P9ACF8i/jCUwx0ntx6VOvUBw63Y7qxjHaB2ah3BNK+43xNYc/r8tmMXnYlxDRlINBuhzQ6HF3ryXjheN3v1HWDYy9krm4V5BscYw1Z8uhJ11RF0yYNq1CAShEPqNLBRqO+gMHUbsmSgDeKsjVaeEEoByVxWHEmDAABV1TF8xVtFMfJwGKy7QuX6DDSUtd2bT1t0VnRD4f7J8WXYyq8Sy0Id5OoPW7vn9RNIWQMpw5vAiG/sV+u/BbQ2UlrvDaKQ6ndcZb7aLZtgxgCSwxF+ZZewHIW68fjzQl8xiS5i0o3afiUQodeJ37TgL7tn6J++NPww6fiybFcROf+u9s07LgoEC90zXzl9NVqx22UOTyvxf8ezx/CQHB7cEBJdFdfC3140et2AtdPvt6nrsXYEpANFbLd6+7+8BoUjlQlgutrany3fmx3XKYc9lSum2syyLFKgCmjI0ddhUHU/B+wJr10T1zX4LmAdRye0Th3HB95Dkwxm4Qq3xidRLwIwruo7Zm+1EBphhFaVVPL+JUqyZd40D4Plxl5Xo9LePuvDA7iEg61o5MYZRS86dr60IWV0YliMepXVcyOF9RA48oXSwOU+xZbxYFCbAsxwDWJjLQxf5Xp3u5P6w6LqvMaQc/H5fTJgR+fp551OC13+viVTCD+OrdK0Wy0D2sT0nImgnM+R4J4EUQVC1JvyPplBycRtut7j/YeoT5CczS7w0VsH+ThaUcVoA7WZDso9eXCbJWQMqv25I7pXXR3PSliC+PWICEl24JS3EsJmsjXZZQwAeIJLL8g0dt3PvxyCTm+0fNpQ6CNLye3rewi7rp1tYjcuBDxJb4uh9mESxGpAdGENF8oDbfb8zPYZ3+NRK81m518DgN3U4AnyJ2Wo7uZbAQHh8IgmmJ5YEsqASUh71fxz7Mb/fHpfn7xPf1/qjjOK448CoNr01+W2Y3uGSi6UJxS/eLTV2hzDjqdiO8kE7PM+TN91kZCfpQ8zGlk2ZKvlMFHxLE9S4OlvioZBey6erxbecp9rB0flSVW6Yi9WJOjyK65nWD5ld/G1668770aKM+R7A72MNr2xxwUqrPSy2jSeNLvsmtt1LiwuF34YnPDG+WrkCHC5FlwuFS2hBFpEWE5U1GqxzpFcBvElOTHqYqQUfJXHtuHtOcc3zpnA0mt+DXSCgxwZ2bnHHi48S497+SPx6zYt4E/A47YgSryXihxotYXSf0scFcZe4yx6mE38AnZoTqQZoGDufP0iDe+UqSFQzmdP/5+TP1f8FktsSQnUeMWRqSbjcD6SilrObwf6mJKSVbdj3Q1dxYzrnJQqPURuXw2gTEmGDp5SaNqSxGrqjprw+yXQH/C06JKbQipuDzjeuR25SqRn9awH8hIsb4MTEFn4ddD/l9A+xtLGB1vogxkUuMweenPyY/X+63fPPdryJdm4TDqjBiTBCSZdjTMUmV2CZL7RRWQVkfbVS+pxmszIEYwylZBjNxMX+tIbz8qE4e7vnbwcJDJNT4Vix+3b94nCxF3ecxz/c9jaPHtZmWhcnzWK9TdCxUx4MqS9rRMVpFmoyYYhk8an7/C0Y1fDNe1U9XgsiJdC5eIv9mGPP3/NUhGQ4eH/YcPsYmhsQJWYi6L8iQ08UNAET51vzNr73PDQVUA0/r2ESxUmbjE0OyiHyAbWoxSoQ/3J3rjtowEIXHlicXX2JCyApCkkpVq77/G1Y4pF7XDRjjBrLfr9XuIqGj8TgZe85Qc2B+3Jly7xwteS5GrXhl3+IXBtXTJ5WpIQwkFBzS5xhfm5+/Ttl1WHu/q0zty3UDGKFeypFIyzUSTBewdYX41z3Md5NbfY7mNba7YdeX71dIMH3AP4b7HVoCk7Hmfd9z45a1M8fTbL48lomAS5IRqDBLx1OZ0h8zHJtaGP4xB61zp4NoGVGmSjBLUVEc0/mphuP4qc6lwmqwi/tePUBEpl9/MN2SJ3eb0H/3IVW+/bBm1lh/tkbA4n49gEULw0KcLiVpEvo1B5WffL9mYMfsgM5RuQp4Tk+SYNi4MBtFQhryUGV8f2+dOW7LIwkKYp0mwagFsz8BicBJmZ93VpPvB9+43e5Y/LuzwWu/4UkSDF+YwYMAiZWx8wN8/PkB2PboDr5cqgbQHsHhlCLBUAE+wqiXWBk7b8Kvx3jzJkTPwKFePvfihXKXbkli0G4YNuCjSAVp8eeTXPT4ZuaT2D9Z61/hXU/K1C0nXSeUZAJdoAWfmtSQGjTSLJMj3pqRVQywjDQeapY2hS7Mn6V+JBRSY+cf+eQ5wi2axYF3OMltTDpyZyU9qwvl8Af9x4kUISn+vKyJaV7W/Y7cg78N7bKMWGwNz0BjdFk8J0JujQLfCO4P6xK19Th2qPgU89XTuoB9Khj43G3dwfugPgS4iPZSwJLGCnPQkvLDrt1/OBWJ4XldWgVXFL2u5gLeB1UjOIwno4kH45Wd1inqp0uZdO8OKMbMPikIBi9GU3DAUSMskfOztZ5+FO69aaEzdJ2TPz7H/QAvRjz6DXK6zxKdIZVy/kEDWBNWbNocXg3GfEadYqQ5e7W5FgxoUg+9rjRZNLBZ7GFTOF6Fks6/MXMbC9MyO1Slhk2D8lFlvG1venlmUOzM5csD5DWpXp5xn0Y+eR8TjVIaodobd3XBM7JD2D7H+DMkZnTpABgFqD8uGpcFySR8BXT87SDUAEAkQIsATYZHI5yAr8E5fkfiF1048N7UMUypq/0Ka8gwxD/y8hGANKLAuek6o/B1qEk4bgu6OAGQumrmBJ6NfhvSduMnz8hDlDZi9hJIluF89KI9txP1ElmQiU5LqSak7gaGUcOMH+QscT6hy6etGwvv5QnVuWawOii0pP9AyZHBY+BHRL/aFDS0MuU53P99uCR2ZTXC2rDOapJAm45EMBWTK9JeG4Ir/BQqFSkVrEw+KnofJQeWcq/2ycQ0gWFqviryT6FCsgPCughJg1F6yP9fwJjbRwUR0M0iAY6TXc6JwbpYVcK1CdkqCxIDB0ZK43tH5EWSD2I4drAug6JR3E83DYmhREX240XTck7dWXXQsC7CUSVt2AwkCl6T6nOjOR8RVoZJ+iyyY0EjtsMpCzsrRDFYH9TUIXnYVCSe8iARAnmjJeRv4HjHHT3qhWl9UNLE+In4sML1+DcOFovSjjQ8Qaf5umjqk14aldhTy+fd19C/pZEkEoRXwBSNIEKablO6jHQFjDTDf+6l2Ehq8eAbihdJ16OJbhkIYUMZ9y96EscebrNxWaJ1obAuuaK3eBddgu5ebmt/9nRJ76y7fVl+d3d2y43CMBSuNFuPrSbUPzEDifP+r7nbDFvMiAQwEAzfXa86Pj06kn86JPYj9dIuB5AlUZeXR3NHkAUp/y3jqMjNIV/MxwuOIUvSXPfWly6fZ9wCkxC6H885iixY533y8nnCbZApt2ov2e1WcUfx8o0bccs6Xu44lgzs8jpe9j7P/U+XjONlyuCyeTN6GS/HaEVoADKOl81k0VnfG11xI3zWB3VfuBEW0sCnFyRHGP+DhDQEnq+9h1KHCBcjIBGFiGfekg4RLhcJ6Rj8B38PtP9wcSXMQRH+WOb+EbP/cAkFzMQjMsvsPVxcAbMRhMgts79HC7+QkcBIN0xsmR1vi9g3TOca5rcx7biKQi1hOSz+8nORtNcWfbFclPmGaTg9xt/dnbk4XwlYHIst56+9VZGrSwHrYDDiuqMqIuaTFRzT9qV9VJGzEtamDBiHTP5VFKyCdyB8HDJ/8p7o2Oi2JlLH6Zvxvoi8gDfBlblnW0VGwdtR1mHDNc/TBf1mVbg01wyrKJSwIaqmx6Ygt7tosrA1RfgRJq9ttFaQAQUhXjMK3VBBHgiPeM8ldFfszXKyDWXA1Dlm4SpyEtaiQtRTNRf6/CeDSZcKWA+NiDRZdnv+3LxHGwEr4h7KTw4viQnCfO+jhB4QpgkjaHqP3tPIQs0vKqc7bbMeTdNKSIhUXZIyBvTE06jFerMaL0nlHSW9dWkHJLGyMKdlrDL+hFJal9y2xKwXRPo9Ix05bYyvbSEFjEXWgRXCBEpsUTCZsLZdSHMxhlE2YEPorspSGBVO9cx3m6cEu6x9e1pqxH5ZSjd2nRdsoTW/cn5OyNehCnjyNcdY2FhXYUY/8xaEEQLGUfmyNebSb90pOKe9rQaqWhTaCWDICzawXiLD+H9SqwbfhZfcylXn0OOebhceJUqMTFVD2CdLjTGk2F0Y90vpdWClpYd0sU2g863DrfnJL2MXsmJ8rOp20THCYQPrRCJa6QVaxKVv6QIHdJF9ne7W6etiEbs4BaOx1N9+S8IOVaSk63/SrAKvuMZbLxu1boXnoaThwdcCdrkMmYUt0fZYu4t/ppiNZOmf3sKAX2T/JsFjLAzOt4tuZJGFN9oUr7xzo7gWWKHwVsSNVHbrjmeRxC4Ff9DQK4zqiKznzC7RIoUNg3dkQndXwQuFrx4qelIWut9F4LGL4V28XxgdK2kSRl3+l1WesIFt73mrrdlpPNP6qSzUv/wQ76W7kOi3S9N/WsrYffXHAH8BW54nQSKWSUgAAAAASUVORK5CYII='

  static get PAGE_SIZE () {
    return PAGE_SIZE
  }

  static get logLevel () {
    return Logger.level
  }

  static set logLevel (level) {
    Logger.level = level
    Logger.info('%cFlickr Coverflow 2.1.1', 'font-size:80%;padding:0.2em 0.5em;color:#FFFFD5;background-color:#FF0066;')
  }

  static get #touchEnabled () {
    return 'ontouchstart' in window
  }

  #threeD = false
  #size = 'small'
  #startX = 0
  #deltaX = 0
  #offset = 0
  #images = []
  #initialized = false
  #startTime = Number.NEGATIVE_INFINITY
  #container
  #dataSource
  #template
  #startTarget
  #prefix
  #indexAttribute
  #visibleCssClass
  #firstVisibleCssClass
  #medianVisibleCssClass
  #lastVisibleCssClass
  #frameCssClass

  #on = {
    init: new Signal(),
    load: new Signal(),
    zoom: new Signal(),
    previous: new Signal(),
    next: new Signal()
  }
  
  get #bufferEndReached () {
    return !this.#images[this.#offset + PAGE_SIZE]
  }
  
  get #nextImage () {
    return this.#images[this.#offset + PAGE_SIZE - STARTING_FRAME]
  }
  
  get #nextMounted () {
    return this.#allFrames[this.#offset + PAGE_SIZE]
  }
  
  get #allFrames () {
    return Array.from(this.#container.querySelectorAll(`.${this.#frameCssClass}:not([${TEMPLATE_ATT}])`))
  }
  
  get #visibleFrames () {
    return Array.from(this.#container.querySelectorAll(`.${this.#visibleCssClass}`))
  }
  
  get #median () {
    return this.#visibleFrames[MEDIAN]
  }
  
  get #frameRightOfMedian () {
    return this.#visibleFrames[MEDIAN + 1]
  }
  
  get #pageChanged () {
    return this.#offset % PAGE_SIZE === 0
  }

  constructor ({
    dataSource,
    container,
    size = 'medium',
    '3d': d3 = false,
    prefix = 'flickrCoverflow'
  } = {}) {
    Logger.log(`${Coverflow.#CLASS_ID} - constructor`)
    Logger.debug(`${Coverflow.#CLASS_ID} - constructor -`, { size, d3 })

    const validator = new Validator(Coverflow.#CLASS_ID).method('constructor')

    validator.checkDefined({dataSource})
    validator.checkString({size}, ['small', 'medium', 'large'])
    validator.checkString({prefix})

    if (!container || !(container instanceof window.HTMLElement)) {
      throw Error(`${Coverflow.#CLASS_ID} - constructor - parameter container is required and must be an HTMLElement. Actual: ${container}`)
    }

    if (!container.id || document.querySelectorAll(`#${container.id}`).length > 1) {
      throw Error(`${Coverflow.#CLASS_ID} - constructor - parameter container must have a unique id. Actual: ${container.id}`)
    }

    if (container.classList.contains(this.#prefix)) {
      Logger.warn(`${Coverflow.#CLASS_ID} - constructor - #${container.id} is already a coverflow`)
      return
    }
    
    if (dataSource.pageSize !== PAGE_SIZE) {
      throw new Error(`mismatch between ${Coverflow.name}.pageSize (${PAGE_SIZE}) and ${dataSource.constructor.name}.pageSize (${dataSource.pageSize})`)
    }

    this.#prefix = prefix
    this.#container = container
    this.#threeD = d3
    this.#size = size
    this.#dataSource = dataSource
    this.#indexAttribute = `data-${this.#prefix}-index`
    this.#visibleCssClass = this.#prefix + '--visible'
    this.#firstVisibleCssClass = this.#prefix + '--first-visible'
    this.#medianVisibleCssClass = this.#prefix + '--median-visible'
    this.#lastVisibleCssClass = this.#prefix + '--last-visible'
    this.#frameCssClass = this.#prefix + '-frame'

    this.#generateEventRegisterers()
  }

  #generateEventRegisterers () {
    for (let event of Object.keys(this.#on)) {
      let methodName = `on${event[0].toUpperCase()}${event.substring(1)}`

      if (!this[methodName]) {
        this[methodName] = function dynamicEventRegisterer (listener) {
          this.#on[event].register(listener)
          return { off: () => this.#on[event].unregister(listener) }
        }
      }
    }
  }

  #createFrameTemplate () {
    let template = this.#template = document.createElement('div')

    template.classList.add(this.#frameCssClass)
    template.setAttribute(TEMPLATE_ATT, 'yes')

    template.innerHTML = `<div class="${this.#prefix}-inner-frame">
				<img class="${this.#prefix}-image" src="${Coverflow.#placeholder}" />
				<div class="${this.#prefix}-title"><span>No title</span></div>
			</div>`
  }

  #insertGhostFrame () {
    let frame = this.#template.cloneNode(true)
    frame.style.display = 'none'
    frame.removeAttribute(TEMPLATE_ATT)
    frame.setAttribute(GHOST_FRAME_ATT, '')
    this.#container.appendChild(frame)
    return frame
  }

  #insertFrame (image) {
    let frame = this.#template.cloneNode(true)

    let imageNode = frame.querySelector(`img.${this.#prefix}-image`)
    let url = this.#getImageUrl(image)
    let title = frame.querySelector(`.${this.#prefix}-title span`)

    imageNode.setAttribute(ID_ATT, image.id)
    imageNode.setAttribute(ZOOM_ATT, image.zoom)
    imageNode.setAttribute('alt', image.title)
    
    if (image.description) {
      imageNode.setAttribute(DESC_ATT, image.description)
    }
    
    imageNode.style.backgroundImage = `url(${Coverflow.#placeholder})`
    title.textContent = image.title

    imageNode.addEventListener('error', function errorListener (e) {
      Logger.error(`${Coverflow.#CLASS_ID} - #insertFrame - fail to load\
        image "${url}" due to error ${e}`)
      imageNode.removeEventListener('error', errorListener)
      imageNode.setAttribute('src', Coverflow.#placeholder)
    }, false)

    imageNode.addEventListener('load', () => {
      imageNode.style.backgroundImage = ''
    }, false)

    imageNode.setAttribute('src', url)
    frame.removeAttribute(TEMPLATE_ATT)

    this.#container.appendChild(frame)
    return frame
  }

  #getImageUrl (image) {
    return image[this.#size]
  }

  #attachEvents () {
    Logger.debug(`${Coverflow.#CLASS_ID} - #attachEvents - this.#offset:`, this.#offset)

    if (Coverflow.#touchEnabled) {
      this.#attachTouchEvents()
    } else {
      this.#attachZoomEvent()
      this.#attachPreviousEvent()
      this.#attachNextEvent()
    }
  }

  #attachZoomEvent () {
    this.#container.addEventListener(CLICK, (event) => this.#detectZoom(event.target), false)
  }

  #detectZoom (target) {
    let frame = target.parentElement.parentElement

    if (frame.classList.contains(this.#frameCssClass) && frame.classList.contains(this.#medianVisibleCssClass)) {
      Logger.debug(`${Coverflow.#CLASS_ID} - #detectZoom - "zoom" event detected, dispatching event`)
      this.#on.zoom.send(this.#getEventImagePayload(frame, target))
    }
  }

  #attachTouchEvents () {
    Logger.log(`${Coverflow.#CLASS_ID} - #attachTouchEvents`)

    let container = this.#container

    container.addEventListener('touchstart', (...args) => this.#onTouchStart(...args), false)
    container.addEventListener('touchmove', (...args) => this.#onTouchMove(...args), false)
    container.addEventListener('touchend', (...args) => this.#onTouchEnd(...args), false)
  }

  #onTouchStart (event) {
    let firstTouch = event.targetTouches[0]
    this.#startX = firstTouch.pageX
    this.#startTime = Date.now()
    this.#startTarget = firstTouch.target
    Logger.debug(`${Coverflow.#CLASS_ID} - #onTouchStart - this.#startX:`, this.#startX)
  }

  #onTouchMove (event) {
    let endX = event.targetTouches[0].pageX
    let deltaX = this.#deltaX = endX - this.#startX

    event.preventDefault()

    const reset = () => {
      this.#startX = endX
      this.#deltaX = deltaX = 0
    }

    Logger.debug(`${Coverflow.#CLASS_ID} - #onTouchMove - this.#deltaX:`, deltaX)

    if (deltaX > TOUCH_MOVE_STEP) {
      reset()
      this.#goToPreviousFrame()
    }

    if (deltaX < -TOUCH_MOVE_STEP) {
      reset()
      this.#goToNextFrame()
    }
  }

  #onTouchEnd (event) {
    let deltaTime = Date.now() - this.#startTime
    let startTarget = this.#startTarget
    this.#startTime = Number.NEGATIVE_INFINITY
    this.#startTarget = undefined
    this.#deltaX = 0

    if (startTarget === event.changedTouches[0].target &&
      deltaTime <= TAP_THRESHOLD_DURATION) {
      this.#detectZoom(startTarget)
    }
  }

  #goToPreviousFrame () {
    let offset = this.#offset

    if (offset) {
      let frames = this.#allFrames
      let lastFrame = frames[offset + PAGE_SIZE - 1]

      lastFrame.classList.remove(
          this.#visibleCssClass,
          this.#firstVisibleCssClass,
          this.#medianVisibleCssClass,
          this.#lastVisibleCssClass
      )

      lastFrame.removeAttribute(this.#indexAttribute)
      this.#offset = --offset
      let previous = frames[offset]
      previous.classList.add(this.#visibleCssClass)
      this.#setVisibleFramesPosition()

      const currentFrame = this.#median
      const currentImage = currentFrame.querySelector(`.${this.#prefix}-image`)
      this.#on.previous.send(this.#getEventImagePayload(currentFrame, currentImage))

      return true
    }

    Logger.debug(`${Coverflow.#CLASS_ID} - #goToPreviousFrame - this.#offset:`, offset)
  }

  #setVisibleFramesPosition () {
    let isFirstMarkerSet = false
    let isLastMarkerSet = false

    this.#visibleFrames.forEach((frame, position) => {
      const nextVisibleFrame = this.#visibleFrames[position + 1]

      frame.setAttribute(this.#indexAttribute, position)

      frame.classList.toggle(
          this.#firstVisibleCssClass,
          !isFirstMarkerSet && (isFirstMarkerSet = !frame.hasAttribute(GHOST_FRAME_ATT))
      )

      frame.classList.toggle(
          this.#medianVisibleCssClass,
          position === MEDIAN
      )

      frame.classList.toggle(
          this.#lastVisibleCssClass,
          !isLastMarkerSet &&
            position >= MEDIAN &&
            (isLastMarkerSet = !nextVisibleFrame || nextVisibleFrame.hasAttribute(GHOST_FRAME_ATT))
      )
    })
  }

  #goToNextFrame () {
    let nextMounted = this.#nextMounted
    let frameRightOfMedian = this.#frameRightOfMedian

    if (this.#nextImage || (nextMounted && frameRightOfMedian && !frameRightOfMedian.hasAttribute(GHOST_FRAME_ATT))) {
      let offset = this.#offset
      let firstVisibleFrame = this.#allFrames[offset]

      firstVisibleFrame.classList.remove(
          this.#visibleCssClass,
          this.#firstVisibleCssClass,
          this.#medianVisibleCssClass,
          this.#lastVisibleCssClass
      )

      firstVisibleFrame.removeAttribute(this.#indexAttribute)

      if (nextMounted) {
        nextMounted.classList.add(this.#visibleCssClass)
        this.#offset = ++offset
        this.#loadNextPageOnChange()
      } else {
        this.#appendNextFrame()
      }
      this.#setVisibleFramesPosition()

      const currentFrame = this.#median
      const currentImage = currentFrame.querySelector(`.${this.#prefix}-image`)
      this.#on.next.send(this.#getEventImagePayload(currentFrame, currentImage))
      
      return true
    }

    Logger.debug(`${Coverflow.#CLASS_ID} - #goToNextFrame - this.#offset:`, this.#offset)
  }
  
  #getEventImagePayload (frame, target) {
    return {
      id: target.getAttribute(ID_ATT),
      frame,
      frameIndex: this.#offset + MEDIAN,
      imageIndex: this.#offset,
      target,
      url: target.getAttribute(ZOOM_ATT)
    }
  }

  #loadNextPageOnChange () {
    if (this.#pageChanged && this.#bufferEndReached) {
      this.loadNextPage()
    }
  }

  #appendNextFrame () {
    let nextImage = this.#nextImage

    if (nextImage) {
      this.#offset++
      this.#insertFrame(nextImage)
      this.#loadNextPageOnChange()
    }
  }

  #attachPreviousEvent () {
    this.#attachSwitchFrameEvent((index) => index < MEDIAN, (...args) => this.#goToPreviousFrame(...args))
  }

  #attachNextEvent () {
    this.#attachSwitchFrameEvent((index) => index > MEDIAN, (...args) => this.#goToNextFrame(...args))
  }

  #attachSwitchFrameEvent (check, changeFrame) {
    this.#container.addEventListener(CLICK, (event) => {
      let frame = event.target.parentElement.parentElement

      if (frame.classList.contains(this.#frameCssClass)) {
        const index = parseInt(frame.getAttribute(this.#indexAttribute), 10)
        if (check(index)) { changeFrame() }
      }
    }, false)
  }

  loadNextPage () {
    this.#dataSource.nextPage().then((rawImages) => {
      let images = this.#images
      let imagesCount = images.length
      let firstLoad = !imagesCount

      images.push(...rawImages.map((rawImage) => {
        let image = {
          id: rawImage.id,
          title: rawImage.title,
          small: rawImage.url_t,
          medium: rawImage.url_s,
          large: getLargeUrl(rawImage),
          zoom: getZoomUrl(rawImage),
          description: getDescription(rawImage)
        }

        let frame = this.#insertFrame(image)

        if (imagesCount++ < PAGE_SIZE - STARTING_FRAME) {
          Logger.debug(`${Coverflow.#CLASS_ID} - loadNextPage - imagesCount: ${imagesCount}`)
          frame.classList.add(this.#visibleCssClass)
        }

        return image
      }))

      if (firstLoad) {
        this.#setVisibleFramesPosition()
        this.#on.init.send()
      }

      if (rawImages.length) {
        this.#on.load.send()
      }

      if (rawImages.length < PAGE_SIZE) {
        for (let index = STARTING_FRAME; index--;) {
          this.#insertGhostFrame()
        }
      }
    })
  }

  init () {
    if (!this.#initialized) {
      let style

      style = new Style({
        containerId: this.#container.id,
        size: this.#size,
        '3d': this.#threeD,
        prefix: this.#prefix
      })

      style.insertSheets()

      this.#createFrameTemplate()
      this.#attachEvents()

      for (let index = STARTING_FRAME; index--;) {
        this.#insertGhostFrame().classList.add(this.#visibleCssClass)
      }

      this.loadNextPage()

      this.#initialized = true
    } else {
      Logger.warn(`${Coverflow.#CLASS_ID} - init - already initialized`)
    }
  }

  next () {
    return this.#goToNextFrame()
  }

  previous () {
    return this.#goToPreviousFrame()
  }
}
