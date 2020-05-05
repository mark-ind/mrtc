import "reflect-metadata";
import { injectable } from "inversify";
import { Types } from "./types";
import getDecorators from "inversify-inject-decorators";
import Container from "./Container";
import IocLoader from "./IocLoader";

const { lazyInject } = getDecorators(Container.getInversifyContainer());

export { Container, IocLoader, Types, lazyInject, injectable }; 