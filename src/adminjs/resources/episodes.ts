import { Episodes } from "@prisma/client";
import { ComponentLoader, FeatureType, ResourceOptions } from "adminjs";
//@ts-ignore
import uploadFeature from "@adminjs/upload";
import path from "path";
import { fileURLToPath } from "url";
import { prisma } from "../../database";

export const componentLoader = new ComponentLoader

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const episodeResourceOptions: ResourceOptions = {
    actions: {
        list: {
            before: async (request, context) => {
    
                const courses = await prisma.courses.findMany({
                    include: {
                        category: true, // Inclui a relação
                    },
                    
                });
                console.log(courses)
    
                return {
                    ...request,
                    records: courses.map((course) => ({
                        ...course,
                        categoryTitle: course.category?.name, // Adiciona título da categoria
                    })),
                };
            },
        },

    },
    navigation: 'Catálogo',
    editProperties: ['name', 'synopsis', 'courseId', 'order', 'uploadVideo', 'secondsLong'],
    filterProperties: ['name', 'synopsis', 'courseId', 'secondsLong', 'createdAt', 'updatedAt'],
    listProperties: ['id', 'name', 'courseId', 'order', 'secondsLong'],
    showProperties: ['id', 'name', 'synopsis', 'courseId', 'order', 'videoUrl', 'secondsLong', 'createdAt', 'updatedAt'],
    properties: {
        courseId: {
            type: "reference",
            reference: "Courses",
            isVisible: { show: true, edit: true, filter: true, list: true }
        }
    }
};

export const episodeResourceFeatures: FeatureType[] = [
    uploadFeature({
        componentLoader,
        provider: {
            local: {
                bucket: path.join(__dirname, "..", "..", "..", "uploads"), // Caminho para a pasta de uploads no servidor
                opts: {
                    baseUrl: "/uploads", // URL base para acessar os arquivos carregados
                },
            },
        },
        properties: {
            key: "videoUrl", // Campo onde o URL do vídeo será armazenado
            file: "uploadVideo", // Nome do campo de upload no AdminJS
        },
        uploadPath: (record: Episodes, filename: string) =>
            `videos/course-${record.courseId}/${filename}`, // Caminho customizado do arquivo
    }),
];
