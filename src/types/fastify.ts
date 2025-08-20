import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

// Extended FastifyInstance with custom decorators
export interface AuthenticatedFastifyInstance extends FastifyInstance {
  authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  generateRefreshToken: (payload: JwtPayload) => string;
  generateAccessToken: (payload: JwtPayload) => string;
  sequelize: any; // Will be properly typed when we update sequelize plugin
  redis: any; // Will be properly typed when we update redis plugin
}

// JWT Payload interface
export interface JwtPayload {
  userId: string;
  roleId: number;
  roleName?: string;
  statusId?: number;
  statusName?: string;
  workspaceId: string;
  workspaceName: string;
}

// Extended request interfaces
export interface AuthenticatedRequest extends FastifyRequest {
  decodedToken?: JwtPayload;
  apiKey?: string;
}

export interface WorkspaceRequest extends AuthenticatedRequest {
  headers: {
    'x-workspace-id': string;
    authorization: string;
    [key: string]: string | undefined;
  };
}

// Response interfaces
export interface ApiResponse<T = any> {
  data?: T;
  meta?: {
    message?: string;
    timestamp?: string;
    [key: string]: any;
  };
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

export interface ErrorResponse {
  isError: boolean;
  message: string;
  origin: string;
  timestamp: Date;
  code?: string;
  details?: any;
}
