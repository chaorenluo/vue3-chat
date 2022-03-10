module.exports = {
  root: true, // 此项是用来告诉eslint找当前配置文件不能往父级查找
  env: { // 预定义的全局变量，这里是浏览器环境

  },
  extends:  ["plugin:vue/vue3-essential", "@vue/standard"],
  parserOptions: {
    sourceType: 'module',
    parser: 'babel-eslint' // 解析器，默认使用 Espree
  },
  rules: {
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "semi": [
        "error",
        "always"
    ],
    "indent": [
      "error",
      4
    ],
    "space-before-function-paren": 0,
    "eol-last": 0,
    "no-useless-escape": "off",
    "max-len": [
        2,
        200,
        4,
        {
            "ignoreUrls": true
        }
    ],
    "prefer-const": [
        "error",
        {
            "destructuring": "all",
            "ignoreReadBeforeAssign": false
        }
    ],
    "guard-for-in": "error"
  }
}
