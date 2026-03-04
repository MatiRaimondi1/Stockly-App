import "reflect-metadata";
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index
} from "typeorm";

@Entity("products")
@Index(["userId", "name"])
@Index(["createdAt"])
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    userId!: string;

    @Column()
    name!: string;

    @Column({ unique: true, nullable: true })
    sku?: string;

    @Column("decimal", { precision: 12, scale: 2 })
    price!: number;

    @Column({ default: 0 })
    quantity!: number;

    @Column({ nullable: true })
    lowStockAt?: number;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
