<template>
    <Form @submit="submitData" :validation-schema="formSchema" v-slot="{ errors }">
        <div class="flex flex-col">

            <!-- Grade -->
            <div class="mb-6 flex flex-col">
                <label for="" class="text-white ml-1">Grade</label>
                <Select :options="gradeListFormat" class="h-10"
                    @update:modelValue="(value) => (collectionRate.grade = value)" :class="[
                        !collectionRate.grade
                            ? 'border border-solid border-red-500'
                            : '',
                    ]" />
                <p v-if="!collectionRate.grade" name="" class="text-red-500 ml-1 mt-1 text-md">
                    Grade must have a valid !
                </p>
                <p v-if="checkCreate(collectionRate.grade, collectionRate.tuitionFees)"
                    class="text-red-500 ml-1 mt-1 text-md">
                    Grade already exists !
                </p>
            </div>

            <!-- Tuition Fees -->
            <div class="mb-6 flex flex-col">
                <label for="" class="text-white ml-1">Tuition fees</label>
                <Select :options="tuitionFeesList" class="h-10"
                    @update:modelValue="(value) => (collectionRate.tuitionFees = value)" :class="[
                        !collectionRate.tuitionFees
                            ? 'border border-solid border-red-500'
                            : '',
                    ]" />
                <p v-if="!collectionRate.tuitionFees" name="" class="text-red-500 ml-1 mt-1 text-md">
                    Tuition fees must have a valid !
                </p>
                <p v-if="checkCreate(collectionRate.grade, collectionRate.tuitionFees)"
                    class="text-red-500 ml-1 mt-1 text-md">
                    Tuition fees already exists !
                </p>
            </div>
            <!-- money -->
            <div class="mb-6">
                <label for="money" class="text-white ml-1">Money</label>
                <Field name="money" id="money" type="text" placeholder="Enter money" v-model="collectionRate.money"
                    :value="true"
                    class="w-full border border-solid bg-inherit py-2 text-white px-2 rounded-md"
                    :class="[errors.money ? 'border border-solid border-red-500' : 'border-violet-500']" />
                <ErrorMessage name="money" class="text-red-500 ml-1 mt-1 text-md" />
            </div>
            <!-- start date -->
            <!-- <div class="mb-6">
                <label for="startDate" class="text-white ml-1">Start date</label>
                <Field name="startDate" id="startDate" type="date" v-model="collectionRate.startDate"
                    class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
                    :class="[errors.startDate ? 'border border-solid border-red-500' : 'border-violet-500']" />
                <ErrorMessage name="startDate" class="text-red-500 ml-1 mt-1 text-md" />
            </div> -->
            <!-- end date -->
            <!-- <div class="mb-6">
                <label for="endDate" class="text-white ml-1">End date</label>
                <Field name="endDate" id="endDate" type="date" v-model="collectionRate.endDate"
                    class="w-full border border-solid  bg-inherit py-2 text-white px-2 rounded-md"
                    :class="[errors.endDate ? 'border border-solid border-red-500' : 'border-violet-500']" />
                <ErrorMessage name="endDate" class="text-red-500 ml-1 mt-1 text-md" />
            </div> -->
            <!-- button -->
            <div class="mt-6 flex flex-row">
                <BAdd class="mr-6" />
                <BCancel @click="this.$emit('cancel', false)" />
            </div>
        </div>
    </Form>
</template>

<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";
import Select from "../components/forms/Select.vue";

import CollectionRates from "../services/collection-rates.service";
import Grade from "../services/grade.service";
import TuitionFees from "../services/tuition-fees.service";
import BAdd from "../components/buttons/Add.vue";
import BCancel from "../components/buttons/Cancel.vue";

export default {
    components: {
        Form,
        Field,
        ErrorMessage,
        Select,
        BAdd,
        BCancel,
    },
    props: {
        collectionRate: {
            type: Object,
            default: {},
        },
    },
    emits: ["submit:collectionRate"],
    data() {
        const formSchema = yup.object().shape({
            money: yup
                .string()
                .required("Money must have a valid !")
                .min(2, "Money must be at least 2 characters !"),
            // startDate: yup
            //     .date()
            //     .required("Start date must have a valid!"),
            // endDate: yup
            //     .date()
            //     .required("End date must have a valid!"),
        });
        return {
            formSchema,
            gradeList: [],
            gradeListFormat: [],
            gradeValue: "",
            tuitionFeesList: [],
            tuitionFeesValue: "",
            collectionRates: [],
        };
    },
    methods: {
        submitData() {
            this.$emit("submit:collectionRate", this.collectionRate);
        },
        formatGrade() {
            for (var value of this.gradeList) {
                this.gradeListFormat.push({ _id: value._id, name: value.name + ' - ' + value.schoolYear.name });
            }
        },
        formatCash(str) {
            if(str == "") return "";
            return str
                .split("")
                .reverse()
                .reduce((prev, next, index) => {
                    return (index % 3 ? next : next + ",") + prev;
                });
        },
        async getAllGrades() {
            try {
                this.gradeList = await Grade.getAll();
            } catch (err) {
                console.log(err);
            }
        },
        async getAllTuitionFees() {
            try {
                this.tuitionFeesList = await TuitionFees.getAll();
            } catch (err) {
                console.log(err);
            }
        },
        async getAllCollectionRates() {
            try {
                this.collectionRates = await CollectionRates.getAll();
            } catch (err) {
                console.log(err);
            }
        },
        checkCreate(value, value1) {
            // return this.teachers.filter((teacher, index) => {
            //   return this.toString[index].includes(value.toLowerCase());
            // });
            for (var collectionRate of this.collectionRates) {
                if (
                    collectionRate.grade._id === value &&
                    collectionRate.tuitionFees._id === value1
                ) {
                    return true;
                }
            }
            return false;
        },
    },
    async created() {
        await this.getAllCollectionRates();
        await this.getAllGrades();
        await this.getAllTuitionFees();
        this.formatGrade();
    },
};
</script>
