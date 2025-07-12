<template>
  <el-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    :title="isEdit ? '编辑预约' : '新增预约'"
    width="700px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-tabs v-model="activeTab" class="form-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="预约人" prop="reservePerson">
                <el-input v-model="formData.reservePerson" placeholder="请输入预约人" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="其他人姓名" prop="otherPersons">
                <el-input v-model="formData.otherPersons" placeholder="【其他人姓名】权威宴请信用" />
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="联系方式" prop="contact">
                <el-input v-model="formData.contact" placeholder="请输入联系方式" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="预约会议" prop="meetingType">
                <el-select v-model="formData.meetingType" placeholder="【集体人员会】权威宴请信用">
                  <el-option label="【集体人员会】权威宴请信用" value="group_banquet" />
                  <el-option label="部门会议" value="department_meeting" />
                  <el-option label="客户洽谈" value="client_meeting" />
                  <el-option label="培训会议" value="training_meeting" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        
        <!-- 其他信息 -->
        <el-tab-pane label="其他信息" name="other">
          <el-form-item label="宴用限选" prop="banquetRestriction">
            <el-input 
              v-model="formData.banquetRestriction" 
              placeholder="请选择宴用限选或输入限制条件"
              type="textarea"
              :rows="2"
            />
          </el-form-item>
          
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参与人" prop="participants">
                <el-input-number 
                  v-model="formData.participants" 
                  :min="1" 
                  :max="100"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="使用时间" prop="usageTime">
                <el-date-picker
                  v-model="formData.usageTime"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="请选择开始时间"
                  end-placeholder="请选择结束时间"
                  format="YYYY.MM.DD HH:mm"
                  value-format="YYYY.MM.DD HH:mm"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el