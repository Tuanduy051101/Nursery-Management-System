<template>
    <Form @submit="submitData" :validation-schema="formSchema" v-slot="{ errors }">
        <div class="flex flex-col">

            <!-- Grade -->
            <div class="mb-6 flex flex-col">
                <label for="" class="text-white ml-1">Grade</label>
                <Select :options="gradeListFormat" class="h-10"
                    @update:modelValue="(value) => (class_s.grade = value)" :class="[
                        !class_s.grade
                            ? 'border border-solid border-red-500'
                            : '',
                    ]" />
                <p v-if="!class_s.grade" name="" class="text-red-500 ml-1 mt-1 text-md">
                    Grade must have a valid !
                </p>
                <p v-if="checkCreate(class_s.name, class_s.grade)"
                    class="text-red-500 ml-1 mt-1 text-md">
                    Grade already exists !
                </p>
            </div>
            <!-- name -->
            <div class="mb-6">
                <label for="name" class="text-white ml-1">Class Name</label>
                <Field name="name" id="name" type="text" placeholder="Enter class name" v-model="class_s.name"
                    :value="true"
                    class="w-full border border-solid bg-inherit py-2 text-white px-2 rounded-md"
                    :class="[errors.name ? 'border border-solid border-red-500' : 'border-violet-500']" />
                    <p v-if="checkCreate(class_s.name, class_s.grade)"
                    class="text-red-500 ml-1 mt-1 text-md">
                    Class name already exists !
                </p>
                <ErrorMessage name="name" class="text-red-500 ml-1 mt-1 text-md" />
            </div>
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

import Classes from "../services/class.service";
import Grade from "../services/grade.service";
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
        class_s: {
            type: Object,
            default: {},
        },
    },
    emits: ["submit:form"],
    data() {
        const formSchema = yup.object().shape({
            name: yup
                .string()
                .required("Class name must have a valid !")
                .min(2, "Class name must be at least 2 characters !"),
        });
        return {
            formSchema,
            gradeList: [],
            gradeListFormat: [],
            gradeValue: "",
            classes: [],
        };
    },
    methods: {
        submitData() {
            this.$emit("submit:form", this.class_s);
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
        async getAllClasses() {
            try {
                this.classes = await Classes.getAll();
            } catch (err) {
                console.log(err);
            }
        },
        checkCreate(name, grade) {
            // return this.teachers.filter((teacher, index) => {
            //   return this.toString[index].includes(value.toLowerCase());
            // });
            for (var class_s of this.classes) {
                if (
                    class_s.name === name &&
                    class_s.grade._id === grade
                ) {
                    return true;
                }
            }
            return false;
        },
    },
    async created() {
        await this.getAllClasses();
        await this.getAllGrades();
        this.formatGrade();
    },
};
</script>
