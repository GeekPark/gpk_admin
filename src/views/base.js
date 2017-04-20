import api from '../stores/api'

function fetch (_this = {}, currentPage = 1, url = '') {
  api._get({
    url: url,
    data: {
      page: currentPage
    }
  }).then((result) => {
    console.log(result);
    _this.listData = result.data
  }).catch((err) => {
    console.log(err);
     _this.$message.error(err.toString())
  })
}

export default (options) => {
  const base =  {
    computed: {
    },
    data () {
      return {
        currentPage: 1,
        listData: {
          meta: {
            total_count: 0,
            limit_value: 0
          }
        }
      }
    },
    methods: {
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        fetch(this, val, options.url)
        console.log(`当前页: ${val}`);
      }
    },
    watch:{
      'listData.posts': function (val) {
        val.forEach(el => {
          if (el.state === 'published') {el.state = '已发布'}
        })
      }
    },
    beforeMount () {
      fetch(this, 1, options.url)
    }
  }
  return base;
}
