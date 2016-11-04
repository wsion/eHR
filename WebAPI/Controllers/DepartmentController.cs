using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.OData;
using System.Web.Http.OData.Routing;
using eHR.Repository;

namespace eHR.Web.WebAPI.Controllers
{
    /*
    To add a route for this controller, merge these statements into the Register method of the WebApiConfig class. Note that OData URLs are case sensitive.

    using System.Web.Http.OData.Builder;
    using eHR.Repository;
    ODataConventionModelBuilder builder = new ODataConventionModelBuilder();
    builder.EntitySet<Department>("Department");
    builder.EntitySet<Employee>("Employee"); 
    config.Routes.MapODataRoute("odata", "odata", builder.GetEdmModel());
    */
    public class DepartmentController : ODataController
    {
        private Entities db = new Entities();

        // GET odata/Department
        [Queryable]
        public IQueryable<Department> GetDepartment()
        {
            return db.Department;
        }

        // GET odata/Department(5)
        [Queryable]
        public SingleResult<Department> GetDepartment([FromODataUri] int key)
        {
            return SingleResult.Create(db.Department.Where(department => department.ID == key));
        }

        // PUT odata/Department(5)
        public async Task<IHttpActionResult> Put([FromODataUri] int key, Department department)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (key != department.ID)
            {
                return BadRequest();
            }

            db.Entry(department).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(department);
        }

        // POST odata/Department
        public async Task<IHttpActionResult> Post(Department department)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Department.Add(department);
            await db.SaveChangesAsync();

            return Created(department);
        }

        // PATCH odata/Department(5)
        [AcceptVerbs("PATCH", "MERGE")]
        public async Task<IHttpActionResult> Patch([FromODataUri] int key, Delta<Department> patch)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Department department = await db.Department.FindAsync(key);
            if (department == null)
            {
                return NotFound();
            }

            patch.Patch(department);

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DepartmentExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Updated(department);
        }

        // DELETE odata/Department(5)
        public async Task<IHttpActionResult> Delete([FromODataUri] int key)
        {
            Department department = await db.Department.FindAsync(key);
            if (department == null)
            {
                return NotFound();
            }

            db.Department.Remove(department);
            await db.SaveChangesAsync();

            return StatusCode(HttpStatusCode.NoContent);
        }

        // GET odata/Department(5)/Employee
        [Queryable]
        public IQueryable<Employee> GetEmployee([FromODataUri] int key)
        {
            return db.Department.Where(m => m.ID == key).SelectMany(m => m.Employee);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool DepartmentExists(int key)
        {
            return db.Department.Count(e => e.ID == key) > 0;
        }
    }
}
