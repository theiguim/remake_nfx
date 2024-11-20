import { prisma } from "./src/database";


async function teste(){
  try {
    const res = await prisma.categories.create({
        data: {name: "joã", position: 1}

    });

    console.log("Category criada", res)
  } catch (error) {
    console.log("erro ao criar categoria: ", error)
  }
}

async function course(){
    try {
        const res = await prisma.courses.create({
            data: {name: "cursoCriado", synopsis: "teste", categoryId: 10}
            
        });
    
        console.log("cursos criada", res)
      } catch (error) {
        console.log("erro ao criar curso: ", error)
      }
}

// teste()

course()