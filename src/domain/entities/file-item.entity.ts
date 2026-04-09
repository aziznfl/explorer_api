export type ItemType = 'folder' | 'file';

export class FileItem {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly type: ItemType,
    public readonly extension: string | null = null,
    public readonly parentId: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) { }

  static create(
    id: string,
    name: string,
    type: ItemType,
    extension: string | null = null,
    parentId: string | null,
    createdAt: Date,
    updatedAt: Date
  ): FileItem {
    return new FileItem(id, name, type, extension, parentId, createdAt, updatedAt);
  }
}
