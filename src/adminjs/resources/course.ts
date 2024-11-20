import { ComponentLoader, FeatureType, ResourceOptions } from "adminjs";
// @ts-ignore
import uploadFeature from "@adminjs/upload";
import path from "path";
import { fileURLToPath } from "url";
import { Courses } from "@prisma/client";
import { prisma } from "../../database";

export const componentLoader = new ComponentLoader

export const courseResourceOptions: ResourceOptions = {

    // actions: {
    //     list: {
    //         before: async (request, context) => {
    
    //             const courses = await prisma.courses.findMany({
    //                 include: {
    //                     category: true, // Inclui a relação
    //                 },
                    
    //             });
    //             console.log(courses)
    
    //             return {
    //                 ...request,
    //                 records: courses.map((course) => ({
    //                     ...course,
    //                     categoryTitle: course.category?.name, // Adiciona título da categoria
    //                 })),
    //             };
    //         },
    //     },

    // },


    navigation: "Catálogo",
    editProperties: ['name', 'synopsis', 'uploadThumbnail', 'featured', 'categoryId'],
    filterProperties: ['name', 'synopsis', 'featured', 'categoryId', 'createdAt', 'updatedAt'],
    listProperties: ['id', 'name', 'featured', 'categoryId'],
    showProperties: ['id', 'name', 'synopsis', 'featured', 'thumbnailUrl', 'categoryId', 'createdAt', 'updatedAt'],
    properties: {
        categoryId: {
            type: "reference",
            reference: "Categories", // Certifique-se de que o nome da tabela/modelo está correto
            isVisible: { show: true, edit: true, filter: true, list: true }
        }
    }
    
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const courseResourceFeature: FeatureType[] = [
    uploadFeature({
        componentLoader,
        provider: {
            local: {
                bucket: path.join(__dirname, "..", "..", "..", "public"), // Caminho para a pasta de uploads no servidor
            },
        },
        properties: {
            key: "thumbnailUrl", // Campo onde o URL do vídeo será armazenado
            file: "uploadThumbnail", // Nome do campo de upload no AdminJS
        },
        uploadPath: (record: Courses, filename: string) => {
            const timestamp = Date.now();
            return `thumbnails/course-${timestamp}/${filename}` // Caminho customizado do arquivo
        }

    })
]