import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StateComponent } from './components/state/state.component';
import { DistrictComponent } from './components/district/district.component';
import { BlockComponent } from './components/block/block.component';

const routes: Routes = [
  { path: '', redirectTo: 'state', pathMatch: 'full' },
  { path: 'state', component: StateComponent },
  { path: 'district', component: DistrictComponent },
  { path: 'block', component: BlockComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MdmRoutingModule { }
