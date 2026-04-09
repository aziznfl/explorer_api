import { db, client } from '../src/infrastructure/database/connection';
import { fileSystemItems } from '../src/infrastructure/database/schema';

const BATCH_SIZE = 2000;

function randomName() {
    const names = ['docs', 'images', 'videos', 'music', 'project', 'backup'];
    return names[Math.floor(Math.random() * names.length)];
}

function randomExtension() {
    const exts = ['txt', 'jpg', 'png', 'mp4', 'mp3', 'pdf'];
    return exts[Math.floor(Math.random() * exts.length)];
}

async function seed() {
    try {
        const folders: { id: string }[] = [];

        // create folders
        const folderRows = Array.from({ length: 5 }).map((_, i) => ({
            name: `${randomName()}_folder_${i}`,
            type: 'folder' as const,
            extension: null,
        }));

        const insertedFolders = await db
            .insert(fileSystemItems)
            .values(folderRows)
            .returning({ id: fileSystemItems.id });

        folders.push(...insertedFolders);

        // create files (100k)
        const total = 100000;

        for (let i = 0; i < total; i += BATCH_SIZE) {
            const batch = Array.from({ length: BATCH_SIZE }).map((_, j) => {
                const idx = i + j;
                const parent = folders[Math.floor(Math.random() * folders.length)];

                return {
                    name: `${randomName()}_file_${idx}`,
                    type: 'file' as const,
                    extension: randomExtension(),
                    parentId: parent.id,
                };
            });

            await db.insert(fileSystemItems).values(batch);

            console.log(`Inserted ${i + BATCH_SIZE} rows`);
        }

        console.log('✅ Done 100k rows');
    } catch (err) {
        console.error('❌ Seed error:', err);
    } finally {
        await client.end();
    }
}

seed();