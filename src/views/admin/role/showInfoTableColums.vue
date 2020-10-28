<template>
    <div>
        <p>{{infoRows.realName}}&nbsp;&nbsp;&nbsp;({{infoRows.mobile}})</p>
        <p>{{infoRows.orgName}}</p>
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    props:['infoRows'],
}
</script>

