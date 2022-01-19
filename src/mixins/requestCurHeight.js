var curHeight = {
  data() {
    return {
      curHeight: '1500px',
      searchTableStyle: null
    }
  },
  mounted() {
    this.getCurHeight()
  },
  methods: {
    getCurHeight() {
      const allHeight = document.body.clientHeight
      this.curHeight = allHeight - 350 + 'px'
    }
  }
}

export { curHeight }
