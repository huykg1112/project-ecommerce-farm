import { PartialType } from '@nestjs/mapped-types';
import { CreateStoreOwnerRequestDto } from './create-store_owner_request.dto';

export class UpdateStoreOwnerRequestDto extends PartialType(
  CreateStoreOwnerRequestDto,
) {}

/*
body API:
{

  "approve": true
}
*/
