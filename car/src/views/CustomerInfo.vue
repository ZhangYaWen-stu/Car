<script setup>

import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getCustomerInfo, getClientCar, addClient, addcar} from '@/api/client.js'
import { deleteCarInfo} from '@/api/car'
import { InfoFilled, Delete, Check, Search, Close} from '@element-plus/icons-vue'

const CarForm = ref(null)
const carAddForm = ref(null)

const carAdd = ()=>
{
    carAddForm.value.validate((valid) => {
        if (valid) {
            addCar()
        } else {
            ElMessage.error('请检查输入是否正确')
            return false
        }
    })
}

const clientModel = ref({
    number: null,
    name: "",
    property: "",
    discount: null,
    contact_person: "",
    contact_number: ""
})

const addCar = () => {
    visibleAddCar.value = false
    let params = {
        identification_number: carModel.value.identification_number ? carModel.value.identification_number : null,
        license_plate_number: carModel.value.license_plate_number ? carModel.value.license_plate_number : null,
        color: carModel.value.color ? carModel.value.color : null,
        vehicle_type: carModel.value.vehicle_type ? carModel.value.vehicle_type : null,
        client_number: visRow.value[0] ? visRow.value[0] : null,
        client_name: carModel.value.client_name ? carModel.value.client_name : null,
        client_contact_number: carModel.value.client_contact_number ? carModel.value.client_contact_number : null
    }
    addcar(params).then(() => {
        carModel.value = {
            identification_number :"",
            license_plate_number :"",
            color :"",
            vehicle_type :"",
            client_number : null,
            client_name :"",
            client_contact_number :""
        }
        carList.value = []
        carPageNum.value = 1
        loadCar()
    })
}

const addCarCancel = () => {
    carModel.value = {
        identification_number :"",
        license_plate_number :"",
        color :"",
        vehicle_type :"",
        client_number : null,
        client_name :"",
        client_contact_number :""
    }
    visibleAddCar.value = false
}

const visibleAddCar = ref(false)

const deleteCar = (deletenumber) => {
    carList.value = []
    carPageNum.value = 1
    noMoreData.value = false
    deleteCarInfo({identification_number: deletenumber}).then(() => {
        loadCar()
    })
}

const handleValid = () => {
    CarForm.value.validate((valid) => {
        if (valid) {
            addclient()
            step.value = 2
        } else {
            ElMessage.error('请检查输入是否正确')
            return false
        }
    })
}

const rules = ref({
    name: [
        { required: true, message: '请输入客户姓名', trigger: 'blur' }
    ],
    property: [
        { required: true, message: '请输入性质', trigger: 'blur' }
    ],
    discount: [
        { required: true, message: '请输入折扣', trigger: 'blur' }
    ],
    contact_person: [
        { required: true, message: '请输入联系人', trigger: 'blur' }
    ],
    contact_number: [
        { required: true, message: '请输入联系电话', trigger: 'blur' }
    ]
})

const second = ref(0)

const addclient = () => {
    setTimeout(() => {
        visibleDrawer.value = false
    }, 3000);
    second.value = 3
    let timer = setInterval(() => {
            if (second.value === 0) {
                clearInterval(timer)
            } else {
                second.value--
            }
        }, 1000)
    let params = {
        name: clientModel.value.name ? clientModel.value.name : null,
        property: clientModel.value.property ? clientModel.value.property : null,
        discount: clientModel.value.discount ? clientModel.value.discount : null,
        contact_person: clientModel.value.contact_person ? clientModel.value.contact_person : null,
        contact_number: clientModel.value.contact_number ? clientModel.value.contact_number : null
    }
    addClient(params).then(() => {
        clientModel.value = {
            number: null,
            name: "",
            property: "",
            discount: null,
            contact_person: "",
            contact_number: ""
        }
        clientSearch()      
    })
}

const handleClose = () => {
    visibleDrawer.value = false
    clientModel.value = {
        number: null,
        name: "",
        property: "",
        discount: null,
        contact_person: "",
        contact_number: ""
    }
}

const clientPageNum = ref(1)
const clientPageSize = ref(10)
const carPageNum = ref(1)
const carPageSize = ref(3)
const visibleDrawer = ref(false)
const visRow = ref([])
const step = ref(1)

const ClientCar = ref([{
    identification_number :"",
    license_plate_number :"",
    color :"",
    vehicle_type :"",
    client_number : null,
    client_name :"",
    client_contact_number :""
}])

const carModel = ref({
    identification_number :"",
    license_plate_number :"",
    color :"",
    vehicle_type :"",
    client_number : null,
    client_name :"",
    client_contact_number :""
})

const ruleCar = ref({
    identification_number: [
        { required: true, message: '请输入车架号', trigger: 'blur' }
    ],
    license_plate_number: [
        { required: true, message: '请输入车牌号', trigger: 'blur' }
    ],
    color: [
        { required: true, message: '请输入颜色', trigger: 'blur' }
    ],
    vehicle_type: [
        { required: true, message: '请选择车型', trigger: 'blur' }
    ],
    client_name: [
        { required: true, message: '请输入联系人姓名', trigger: 'blur' }
    ],
    client_contact_number: [
        { required: true, message: '请输入联系人电话', trigger: 'blur' }
    ]
})


const cartotal = ref(0)


const clientLoading = ref(false)
const carLoading = ref(false)
const noMoreData = ref(false)

const clientTotal = ref(0)
const Client = ref([{
    number: 0,
    name: "",
    property: "",
    discount: 0.0,
    contact_person: "",
    contact_number: "",
}])

const clientSearch = async () => {
    clientLoading.value = true
    let params = {
        pageNum: clientPageNum.value,
        pageSize: clientPageSize.value,
        name: clientModel.value.name ? clientModel.value.name : null,
        property: clientModel.value.property ? clientModel.value.property : null,
        contact_person: clientModel.value.contact_person ? clientModel.value.contact_person : null
    }
    let clientInfo = await getCustomerInfo(params)
    clientTotal.value = clientInfo.data.data.total
    Client.value = clientInfo.data.data.items
    clientLoading.value = false
}
const carsearch = async (number) =>{
    carLoading.value = true
    let params = {
        pageNum: carPageNum.value,
        pageSize: carPageSize.value,
        client_number: number ? number : null,
    }
    let CarInfo = await getClientCar(params)
    ClientCar.value = CarInfo.data.data.items
    cartotal.value = CarInfo.data.data.total
    carLoading.value = false
}

const carList = ref([])

const onSizeChange = async (val) => {
    clientPageSize.value = val
    clientSearch()
}

const onCurrentChange = async (val) => {
    clientPageNum.value = val
    clientSearch()
}


const rowChange = (row, expanded) => {
    visRow.value = []
    if (expanded.length > 0) {
        visRow.value = [row.number]
        carList.value = []
        carPageNum.value = 1
        noMoreData.value = false
        loadCar() 
    }
}


const loadCar = ()=>{
    carsearch(visRow.value[0]).then(() => {
        if(cartotal.value > ((carPageNum.value - 1) * carPageSize.value)){
        carPageNum.value ++
        carList.value.push(...ClientCar.value)
        noMoreData.value = false
        }else{
            noMoreData.value = true
        }
    })
    
}
clientSearch();

</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>用户管理</span>
                <div class="extra">
                    <el-button type="primary" @click="visibleDrawer = true, step = 1">添加用户</el-button>
                </div>
            </div>
        </template>

        <el-dialog v-model="visibleAddCar" title="添加车辆" width="500">
            <el-form :model="carModel" ref="carAddForm" :rules="ruleCar">
            <el-form-item label="车架号" prop="identification_number">
                <el-input v-model.trim="carModel.identification_number" aria-placeholder="请输入车架号"/>
            </el-form-item>
            <el-form-item label="车牌号" prop="license_plate_number">
                <el-input v-model.trim="carModel.license_plate_number" aria-placeholder="请输入车牌号"/>
            </el-form-item>
            <el-form-item label="颜色" prop="color">
                <el-input v-model.trim="carModel.color" aria-placeholder="请输入颜色"/>
            </el-form-item>
            <el-form-item label="车型" prop="vehicle_type">
                <el-select v-model.trim="carModel.vehicle_type" placeholder="请选择车型">
                <el-option label="轿车" value="轿车" />
                <el-option label="SUV" value="SUV" />
                <el-option label="皮卡" value="皮卡" />
                <el-option label="跑车" value="跑车" />
                <el-option label="路虎" value="路虎" />
                <el-option label="客车" value="客车" />
                <el-option label="货车" value="货车" />
                </el-select>
            </el-form-item>
            <el-form-item label="联系人姓名" prop="client_name">
                <el-input v-model.trim="carModel.client_name" aria-placeholder="请输入联系人姓名"/>
            </el-form-item>
            <el-form-item label="联系人电话" prop="client_contact_number">
                <el-input v-model.trim="carModel.client_contact_number" aria-placeholder="请输入联系人电话"/>
            </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addCarCancel">Cancel</el-button>
                    <el-button type="primary" @click="carAdd">Confirm</el-button>
                </div>
            </template>
        </el-dialog>

        <el-form inline>
            <!-- 自动补全输入框 -->
            <el-form-item label="姓名：">
                <el-input name="name" placeholder="请输入客户姓名" v-model.trim="clientModel.name"></el-input>
            </el-form-item>
            <el-form-item label="性质：">
                <el-input name="property" placeholder="请输入性质" v-model.trim="clientModel.property"></el-input>
            </el-form-item>
            <el-form-item label="联系人：">
                <el-input name="contactName" placeholder="请输入联系人" v-model.trim="clientModel.contact_person"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button :icon="Search" circle @click="clientSearch"/>
                <el-button type="info" :icon="Close" circle @click="clientModel.name = ''; clientModel.property = '';clientModel.contact_person = '';clientSearch()"/>
            </el-form-item>
        </el-form>
        <el-table v-loading="clientLoading" 
        :data="Client"
        style="width: 100%" 
        ref="tableRef" 
        :row-key="row => row.number"
        :expand-row-keys="visRow"
        @expand-change="rowChange">
            <el-table-column label="序号" width="80" type="index"></el-table-column>
            <el-table-column label="客户名" prop="name"></el-table-column>
            <el-table-column label="性质" prop="property"> </el-table-column>
            <el-table-column label="折扣" prop="discount"></el-table-column>
            <el-table-column label="联系人" prop="contact_person"></el-table-column>
            <el-table-column label="联系电话" prop="contact_number"></el-table-column>
            <el-table-column type="expand">
                <template #default="{ row }">
                    <div v-if="visRow.includes(row.number)">
                        <div class="details">
                            <ul v-infinite-scroll="loadCar" class="infinite-list" style="overflow: auto" :infinite-scroll-disabled="noMoreData" :infinite-scroll-distance="10">
                                <el-card>
                                    <div class="header">
                                        <span>用户--{{ row.name }}--的车辆管理</span>
                                        <div class="extra">
                                            <el-button type="success" @click="visibleAddCar = true">添加车辆</el-button>
                                        </div>
                                    </div>
                                    <el-table
                                    :data="carList"
                                    style="width: 100%"
                                    v-loading="carLoading">
                                    <el-table-column label="车架号" prop="identification_number"></el-table-column>
                                    <el-table-column label="车牌号" prop="license_plate_number"></el-table-column>
                                    <el-table-column label="车型" prop="vehicle_type"></el-table-column>
                                    <el-table-column label="颜色" prop="color"></el-table-column>
                                    <el-table-column label="操作" width="110" header-align="center">
                                        <template #default="{ row: car }">
                                            <el-popover placement="right" :width="380" trigger="hover">
    
                                                <template #reference>
                                                    <el-icon><InfoFilled /></el-icon>
                                                </template>
                                                <el-card style="max-width: 480px" shadow="always">
                                                    <template #header>
                                                        <div>车牌名：{{ car.identification_number}}</div>
                                                    </template>
                                                        <p>车架号：{{ car.identification_number }}</p>
                                                        <p>颜色：{{ car.color }}</p>
                                                        <p>车型：{{ car.vehicle_type }}</p>
                                                        <p>联系人姓名：{{ car.client_name }}</p>
                                                    <template #footer>联系电话：{{ car.client_contact_number }}</template>
                                                </el-card>
                                            </el-popover>
                                            <el-button :icon="Delete" circle plain type="danger" @click = "deleteCar(car.identification_number)"></el-button>
                                        </template>
                                    </el-table-column>
                                    </el-table>
                                </el-card>
                            </ul>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="没有数据" />
            </template>
        </el-table>
        <el-pagination v-model:current-page="clientPageNum" v-model:page-size="clientPageSize" :page-sizes="[3, 5, 10, 15]"
            layout="jumper, total, sizes, prev, pager, next" background :total="clientTotal" @size-change="onSizeChange"
            @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
            <el-drawer v-model="visibleDrawer" title="添加客户" direction="rtl" size="30%" @close="handleClose">
                <div style="height: 130px">
                    <el-steps :active="step">
                    <el-step title="信息录入" />
                    <el-step title="完成" />
                    </el-steps>
                </div>
                
                <el-form v-show="step === 1" :rules="rules" ref="CarForm" :model="clientModel">
                    <el-form-item label="姓名：" prop="name" >
                        <el-input v-model.trim="clientModel.name" placeholder="请输入客户姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="性质：" prop="property">
                        <el-select
                            v-model.trim="clientModel.property"
                            placeholder="请输入性质"

                        >
                            <el-option label="个人" value="个人" />
                            <el-option label="单位" value="单位" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="折扣：" prop="discount">
                        <el-input v-model.trim="clientModel.discount" placeholder="请输入折扣"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人：" prop="contact_person">
                        <el-input v-model.trim="clientModel.contact_person" placeholder="请输入联系人"></el-input>
                    </el-form-item>
                    <el-form-item label="联系电话：" prop="contact_number">
                        <el-input v-model.trim="clientModel.contact_number" placeholder="请输入联系电话"></el-input>
                    </el-form-item>
                    <el-button type="primary" @click="handleValid">下一步</el-button>
                </el-form>
                
                <el-card v-show="step === 2">
                    <div class="center-container">
                        <el-progress type="circle" :percentage="100" status="success">
                            <el-button type="success" :icon="Check" circle />
                        </el-progress>
                    </div>
                    <div class="center-container">该窗口将在{{ second }}后关闭</div>
                </el-card>

            </el-drawer>
        
    </el-card>


</template>

<style lang="scss" scoped>

.infinite-list {
  height: 150px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}


.page-container {
    // position: relative; /* 相对定位 */
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}

// .pagination-container {
//     position: absolute; /* 绝对定位 */
//     bottom: 20px; /* 定位到底部 */
//     width: 100%; /* 宽度与父容器相同 */
// }
/* 抽屉样式 */
.avatar-uploader {
    :deep() {
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }
}

.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
}

.editor {
    width: 100%;

    :deep(.ql-editor) {
        min-height: 200px;
    }
}
</style>