<template>
<Card style="margin-bottom:16px; text-align:left;" dis-hover>
    <DatePicker type="daterange" :value="param.dateRange" format="yyyy-MM-dd" :options="dateOptions" @on-change="handleDateChange" placeholder="选择日期范围" style="width: 200px"></DatePicker>
    <Button type="primary" @click="handleSearch" style="margin-left:16px;">查 询</Button>
</Card>
</template>

<script>
export default {
    props: {
        param: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dateOptions: {
                shortcuts: [{
                        text: '今天',
                        value() {
                            const end = new Date();
                            const start = new Date();
                            return [start, end];
                        }
                    }, {
                        text: '1周',
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            return [start, end];
                        }
                    },
                    {
                        text: '1月',
                        value() {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            return [start, end];
                        }
                    }
                ]
            }
        }
    },
    methods: {
        handleSearch() {
            this.$emit("on-search");
        },
        handleDateChange(date) {
            this.param.dateRange = date;
        }
    }
}
</script>
