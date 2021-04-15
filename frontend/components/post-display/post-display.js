Component({

    properties: {
        postList: {
            type: Array,
            value: []
        },

        getMode: {
            type: Array,
            value: [{
                modeName: 'getSelfPost'
            }]
        }
    },

    data: {

    },

    methods: {
        chosePost(e) {
            console.log(e)
        }
    }
})