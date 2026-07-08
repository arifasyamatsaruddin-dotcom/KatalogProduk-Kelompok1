const products = [
  {
    id: 1,
    name: 'NIKE AIR MAX X1',
    price: 210,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD17w52mIb2jQT3c7RtL4Xg7OZPLu5uojSUHNAdaOUXO_FWl_gD5HzvQ-4LKv4Q2ngnLYpwOnL-90dIENpw-RQJ9CR1eceDUinKaSv0Y6ckh36pVZF9l3W63jtcUys4aQLJZ8ViL2aACDZsyWgxkDslQFiVJK-cuZBzdjoTRKivipBbgIaCYWxP5H44rX__PYrWQjkWc0aIhOksVRMjSKlzHPRCib8EyTi9fG24XKI_xAYxkBqVAKNc40Daim8p70mMHdmaQbdBf-A',
    description: 'A premium lifestyle sneaker built for comfort and modern performance.',
    category: 'Lifestyle',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ['black', 'blue', 'white'],
    rating: 4.9,
    badge: 'BESTSELLER'
  },
  {
    id: 2,
    name: 'JORDAN 1 RETRO',
    price: 320,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz01j0VQ4o6_zDf2IL2uMtv5jNQigcq3Lp0ct5vTCda-D5HGG9pHIMFaGsiaw33APjDpVrcfKlo0aGIDpqiDt-71yVFm_Z2IuuDkV-x7vDAL9mY6xh--b7q2wRpt8-D6YHGwOviUc0kf8TXYpbw6G3dfpAXnwsq6TVUOZM_IP0LnPqOIGX7xwJn9PXVFQ2VGjR2A5B_CFJkuysX-7qAIXMBmCdijNZY8sgHdUOLmt39o4AgnkmqNQeJR79w6pUEema22XlPw_a820',
    description: 'Classic Jordan craftsmanship with a contemporary laboratory finish.',
    category: 'Basketball',
    sizes: [40, 41, 42, 43, 45],
    colors: ['red', 'white', 'black'],
    rating: 5.0,
    badge: 'LIMITED'
  },
  {
    id: 3,
    name: 'NIKE AIR MAX ALPHA',
    price: 210,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzYTe2ccssxDAfhJ7J5_iyEYa8_y3ZZPb4J3DVtpjoVCf0sq_wa3Q5s5IBwEVItkcHzE5ctF5PSgG9E2VnVz5OtG9AsRn7hv3rzguIUUHh1QB5KmfE0orKMdme1wmSaOiciIaMA_l-6jgUASwaIMFq-4GpjfuGf8C08wglNq2Z9duHugN6zfeVLiNC8b3WeuDuOW52CH9n1Ykz4bTQRkHBflu4Ey1tMbQ_9jsaKDYa9Uj0P13K9MnwVQEWyOa0uaEAeZLVF9QpjGk',
    description: 'Performance-focused running silhouette with premium cushioning.',
    category: 'Running',
    sizes: [38, 39, 40, 41, 42],
    colors: ['grey', 'blue'],
    rating: 4.9,
    badge: 'LAB SPECIMEN'
  },
  {
    id: 4,
    name: 'AIR MAX "LAB ZERO"',
    price: 240,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ9dr7SvZHDB6Ud1N9EDVIe9X9IB6-AlhoSpHcYUK0Kf1b1ZkdW1gfSVx6xc3_IGytcjD0c_38I359GtK7aiSlH1eTdUeHW5SY7_KDWcSTndKdAS1e_C2FeNT13wgleZFJ7n8mx4D9DxNnVIH5u7jIb5V4cPmaYp8hLG0Aq-muAcGJxiOjXgqR57KuqWvln308p8hqZneHcLfUxjM2fLIfAFzjxwSgRZR_9fNQtmtyfHukBZhoKBoJBJht2c9bw7ljyDDIuX29fyo',
    description: 'Futuristic archival prototype demonstrating maximum kinetic cushion return.',
    category: 'Lifestyle',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ['blue', 'white'],
    rating: 4.9,
    badge: 'NEW'
  },
  {
    id: 5,
    name: 'FORUM HIGH ARCHIVE',
    price: 180,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDsgguMD_wkQqbhjTqSlWeowM0TpttAxo5L8bHBzVdolGJXAllg6kkof_gW6rJm2jW_El4reZnDNhE0r40RI-tkTbwAg-qwvOTJnWpCYFByLX9PPG4JDwYyMK-FQ-oiBM4rGasKQzc79ci4OSeFrNF0CwEznhZSDXz4Sl_ixrnHx4w9XyPEu12RUZXGxlDmig4Msm--yNFdT_NV0mtf1fVGQ8IKzG9SOya83TsXXrDcfRKedu-HeLGBY1rMQWXinFR0mD5CPoDa7tk',
    description: 'Classic basketball model updated with premium modern leather specs.',
    category: 'Basketball',
    sizes: [40, 41, 42, 43],
    colors: ['white', 'black'],
    rating: 4.8,
    badge: 'NEW'
  },
  {
    id: 6,
    name: '990v6 PROTOTYPE',
    price: 220,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkrjjcoqd0DYa02z3mvS7ky8QP2OXvQ4YmwwnR6qPXSI0V9dcUu0ADcZ1NFBampjOkH8cp0ihExfNl3MDRSgO540Wpj52nZvgwoYzjiLKfPldKdMNxsFhzLQRD824dr_Uu-dqXYB5S7Fkbiu-phc9UY7w1r8rsPTgRTisBnazO8EOVLEc-FJLA_1Tab2g419jw461H5J6S9K4-tCE4Ma3NQyKuHr9y1CzTBsHyRpSmm76_EEUyO3_UvxApNXljqdp4S6xnJfFJUFU',
    description: 'Highly optimized running specimen engineered for clinical distance performance.',
    category: 'Running',
    sizes: [38, 39, 40, 41, 42, 43, 44, 45],
    colors: ['grey', 'white'],
    rating: 4.9,
    badge: 'NEW'
  },
  {
    id: 7,
    name: 'RETRO HIGH "LAB SLATE"',
    price: 190,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1EHx_HkXg9qTxXYZrjt-zfUtOcx-n-_QBPLTqKWb5ONEIGl0ztH5GOqGbTGSqgiqDuMt_aD-ObskZyn_0Djywpkj0bWOvarCPlvsd-W98pDTzh0vg-hNSICvxqC5t0M9ZB9QScfXFc2WaHoJuQIS9BHG7SOFF2hg0orhy7WM8i3jCQtCCqeBtoXuVqpKhnsZ0-c7P3o1iPejK6VBJddgLFIbRc4L07cMYTXYQ8AVki0zxZgHShcY3mKpuY-nhUX936Q4Z6bUCl8A',
    description: 'Deep archival release featuring technical nubuck overlay styling.',
    category: 'Basketball',
    sizes: [41, 42, 43, 44, 45],
    colors: ['black', 'grey'],
    rating: 5.0,
    badge: 'NEW'
  },
  {
    id: 8,
    name: 'ADIDAS ALPHA FLY',
    price: 260,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIiDNIOJ_jn3LoqX9FoP2cedS4wX0EwQtQ6MVexER3YglIwcX6v8AIN9IN3rdPPa02XxdOJqGeE2vjCyI9Fj21kCJb46YoJCdSQpGEOk8Qbqgf0xN0-1YekZ6jxSWcxE8SGm5Qm_i9DxfowiAg5l0tr0VSRGgCOK28jFpYKFtIXx1QjuBUSLYT5wLYqrDazG8B_X4ZYFWg6S_g75bZtzHgdNeVJrXlgYvqTugFDh-cQ4ssjjA9f1w9ycRi53Moe3PF4wDnEZtgWlc',
    description: 'Ultra-marathon specialized kinetic hardware designed for raw speed.',
    category: 'Running',
    sizes: [39, 40, 41, 42, 43, 44],
    colors: ['blue', 'black', 'white'],
    rating: 4.8,
    badge: 'HOT'
  },
  {
    id: 9,
    name: 'NB VAPORWAVE',
    price: 150,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2bEWf_rhsSXNoevWvUQBe2RMKa3PV3yWsvrO2B3RpGSeYSGXFrpz2_-GsHqnSmbiUF2j956bJ4hxHXoLt_F92gCMzn-CYzTa0FmOg_dXwQKGwFgUPGXmqmQrh2UhmYCQ8gqEc32er_ylfP7ocHyk0I6-rc6s8kXWY8uVdsR1-B1lZAvdeTnqGHRr9MVy8ThibujYADwPAA4IdqVZ11jfTWXTHGU7k5YxpMJjO1HVvWQGmBOsKpEB2r3ga_7UTxHC4BCxxOuL80pc',
    description: 'Vaporwave aesthetics combined with comfortable multi-density foam core.',
    category: 'Lifestyle',
    sizes: [38, 39, 40, 41, 42],
    colors: ['grey', 'blue', 'white'],
    rating: 4.6,
    badge: 'POPULAR'
  },
  {
    id: 10,
    name: 'CYBER RUNNER',
    price: 280,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkZvT1dDEM48zlPR0m52OlweHnzrQYXT76WRlj5BEaRj1vtz3xvCpARmaV9jeeuiVRdmICdT6Kn1euHQcPlGZGAVsyG0dnzgRLxpETik5qtwWL8szkD8IUBlM8XLYVdkkdobmCrcRZQFVmtW11hYLkfpl8j6KAjr7BjAEgddVN-d0NNLYDsYI9cjKU9a11RRFnQsPAaoVcShEea6ezh_AXzR38Yh-L8kEmNxthXgujoguwV_PE9WGz4v70s-Hbz56rcyzxVN_uRsc',
    description: 'Cyberpunk inspired shell featuring modular support units and reflective overlays.',
    category: 'Running',
    sizes: [40, 41, 42, 43, 44, 45],
    colors: ['black', 'red', 'grey'],
    rating: 4.9,
    badge: 'NEW'
  }
];

function listProducts() {
  return products;
}

function getProductById(id) {
  return products.find((product) => product.id === Number(id));
}

module.exports = { listProducts, getProductById };
