import os
import uuid
from typing import Optional, List
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form, status, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Boolean, Text, DateTime, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import jwt, JWTError

# ─── Auth Config ──────────────────────────────────────────────────────────────
SECRET_KEY = "pixel_forge_super_secret_key_123456_change_me"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ─── Database Setup ───────────────────────────────────────────────────────────
DATABASE_URL = "sqlite:///./pixel_forge.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ─── SQLAlchemy Models ────────────────────────────────────────────────────────

class DBAdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

class DBTeamMember(Base):
    __tablename__ = "team_members"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    bio = Column(Text, nullable=False)
    skills = Column(String, nullable=False)  # comma-separated string
    photo_url = Column(String, nullable=False)

class DBTestimonial(Base):
    __tablename__ = "testimonials"
    id = Column(String, primary_key=True, index=True)
    quote = Column(Text, nullable=False)
    author = Column(String, nullable=False)
    role = Column(String, nullable=False)
    avatar = Column(String, nullable=True)
    gradient = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)

class DBProject(Base):
    __tablename__ = "projects"
    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    client = Column(String, nullable=False)
    category = Column(String, nullable=False)
    gradient = Column(String, nullable=True)
    year = Column(String, nullable=False)
    photo_url = Column(String, nullable=True)

class DBBlogPost(Base):
    __tablename__ = "blog_posts"
    id = Column(String, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True, nullable=False)
    category = Column(String, nullable=False)
    tag = Column(String, nullable=False)
    readTime = Column(String, nullable=False)
    date = Column(String, nullable=False)
    title = Column(String, nullable=False)
    excerpt = Column(Text, nullable=False)
    gradient = Column(String, nullable=True)
    featured = Column(Boolean, default=False, nullable=False)
    photo_url = Column(String, nullable=True)

class DBConsultation(Base):
    __tablename__ = "consultations"
    id = Column(String, primary_key=True, index=True)
    category = Column(String, nullable=False)
    budget = Column(String, nullable=False)
    timeline = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    whatsapp = Column(String, nullable=True)
    company = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class DBAgencyStat(Base):
    __tablename__ = "agency_stats"
    id = Column(String, primary_key=True, index=True)
    label = Column(String, nullable=False)
    value = Column(String, nullable=False)
    suffix = Column(String, nullable=False, default="")
    order_index = Column(Integer, nullable=False)

# Create tables
Base.metadata.create_all(bind=engine)

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ─── FastAPI Initialization ───────────────────────────────────────────────────
app = FastAPI(
    title="PIXELFORGE API",
    description="Backend API for PIXELFORGE Digital Agency",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to the PIXELFORGE API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}


# ─── Seeding Initial Data ─────────────────────────────────────────────────────

@app.on_event("startup")
def seed_database():
    db = SessionLocal()
    try:
        # 1. Super Admin Seed
        admin = db.query(DBAdminUser).filter_by(username="admin").first()
        if not admin:
            hashed = pwd_context.hash("admin")
            admin = DBAdminUser(username="admin", hashed_password=hashed)
            db.add(admin)
            print("[SEED] Created Super Admin user 'admin' with password 'admin'")

        # 2. Team Member Seed
        if db.query(DBTeamMember).count() == 0:
            default_team = [
                {
                    "id": "arjun-mehta",
                    "name": "Arjun Mehta",
                    "role": "Lead Designer",
                    "bio": "Arjun is a digital craftsman with 8+ years of experience building immersive brand stories and design systems.",
                    "skills": "Figma, Webflow, UI/UX, Brand Strategy",
                    "photo_url": "http://localhost:8000/uploads/arjun_mehta.png"
                },
                {
                    "id": "sarah-jenkins",
                    "name": "Sarah Jenkins",
                    "role": "Lead Engineer",
                    "bio": "Sarah specializes in React, Node.js, and high-performance WebGL integrations. She makes complex systems fast and reliable.",
                    "skills": "React, TypeScript, Node.js, Three.js",
                    "photo_url": "http://localhost:8000/uploads/sarah_jenkins.png"
                },
                {
                    "id": "dev-patel",
                    "name": "Dev Patel",
                    "role": "Product Strategist",
                    "bio": "Dev works with founders to scope, validate, and launch digital products that find product-market fit.",
                    "skills": "Product Strategy, Agile, User Research, Analytics",
                    "photo_url": "http://localhost:8000/uploads/dev_patel.png"
                },
                {
                    "id": "aisha-rahman",
                    "name": "Aisha Rahman",
                    "role": "AI Researcher",
                    "bio": "Aisha leads our intelligent product design and builds machine learning pipelines for personalized user experiences.",
                    "skills": "Python, PyTorch, LLMs, Prompt Engineering",
                    "photo_url": "http://localhost:8000/uploads/aisha_rahman.png"
                }
            ]
            for member in default_team:
                db.add(DBTeamMember(**member))
            print("[SEED] Seeded 4 default team members")

        # 3. Testimonials Seed
        if db.query(DBTestimonial).count() == 0:
            default_testimonials = [
                {
                    "id": str(uuid.uuid4()),
                    "quote": "PixelForge didn't just build our platform — they redefined how we think about our product. The strategic depth they brought was unlike any agency we'd worked with before.",
                    "author": "Sarah Chen",
                    "role": "CEO, Luminary Ventures",
                    "avatar": "SC",
                    "gradient": "from-blue-500 to-cyan-500"
                },
                {
                    "id": str(uuid.uuid4()),
                    "quote": "The team's ability to translate complex business logic into an elegant, performant application was exceptional. Delivered ahead of schedule, on budget, and the UX is outstanding.",
                    "author": "James O'Brien",
                    "role": "CTO, Nexaflow Inc.",
                    "avatar": "JO",
                    "gradient": "from-purple-500 to-violet-500"
                },
                {
                    "id": str(uuid.uuid4()),
                    "quote": "Working with PixelForge felt like having a world-class product team embedded within our company. They cared about our outcomes as much as we did.",
                    "author": "Priya Nair",
                    "role": "Head of Product, Astra Labs",
                    "avatar": "PN",
                    "gradient": "from-emerald-500 to-teal-500"
                }
            ]
            for t in default_testimonials:
                db.add(DBTestimonial(**t))
            print("[SEED] Seeded 3 default testimonials")

        # 4. Projects Seed
        if db.query(DBProject).count() == 0:
            default_projects = [
                {
                    "id": str(uuid.uuid4()),
                    "title": "Synthetix AI Core Integration",
                    "client": "Synthetix Corp",
                    "category": "AI & Machine Learning",
                    "gradient": "from-blue-600 via-indigo-600 to-purple-600",
                    "year": "2026"
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Aura Luxury E-Commerce Engine",
                    "client": "Aura International",
                    "category": "Web Development",
                    "gradient": "from-purple-600 via-pink-600 to-red-500",
                    "year": "2025"
                },
                {
                    "id": str(uuid.uuid4()),
                    "title": "Nova Fintech Wallet Experience",
                    "client": "Nova Labs Inc",
                    "category": "Mobile Apps",
                    "gradient": "from-emerald-500 via-teal-600 to-blue-600",
                    "year": "2025"
                }
            ]
            for proj in default_projects:
                db.add(DBProject(**proj))
            print("[SEED] Seeded 3 default projects")

        # 5. Blogs Seed
        if db.query(DBBlogPost).count() == 0:
            default_posts = [
                {
                    "id": str(uuid.uuid4()),
                    "slug": "building-ai-products-2026",
                    "category": "AI",
                    "tag": "AI",
                    "readTime": "7 min read",
                    "date": "Jul 18, 2026",
                    "title": "Building AI-First Products in 2026: A Strategic Framework",
                    "excerpt": "The AI landscape has shifted dramatically. We break down how leading product teams are embedding intelligence from day one — not bolting it on as an afterthought.",
                    "gradient": "from-blue-600 via-indigo-600 to-purple-600",
                    "featured": True
                },
                {
                    "id": str(uuid.uuid4()),
                    "slug": "design-systems-scale",
                    "category": "Design",
                    "tag": "Design",
                    "readTime": "5 min read",
                    "date": "Jul 10, 2026",
                    "title": "Why Your Design System Is Your Most Valuable Asset",
                    "excerpt": "A well-maintained design system is the difference between a team that ships in days and one that takes weeks. Here's how we build them.",
                    "gradient": "from-purple-600 via-pink-600 to-rose-500",
                    "featured": False
                },
                {
                    "id": str(uuid.uuid4()),
                    "slug": "react-performance-2026",
                    "category": "Development",
                    "tag": "Development",
                    "readTime": "9 min read",
                    "date": "Jun 28, 2026",
                    "title": "React Performance Patterns That Actually Move the Needle",
                    "excerpt": "We benchmarked 12 optimisation techniques across real client apps. Only 4 consistently delivered meaningful improvements. Here's what worked.",
                    "gradient": "from-emerald-500 via-teal-600 to-blue-600",
                    "featured": False
                },
                {
                    "id": str(uuid.uuid4()),
                    "slug": "ux-audit-process",
                    "category": "Design",
                    "tag": "Design",
                    "readTime": "6 min read",
                    "date": "Jun 15, 2026",
                    "title": "Our 3-Hour UX Audit Process That Reveals Hidden Revenue",
                    "excerpt": "Most UX problems are invisible until you know where to look. Our structured audit framework has uncovered an average of 8 high-impact issues per engagement.",
                    "gradient": "from-amber-500 via-orange-500 to-red-500",
                    "featured": False
                },
                {
                    "id": str(uuid.uuid4()),
                    "slug": "startup-mvp-mistakes",
                    "category": "Business",
                    "tag": "Business",
                    "readTime": "4 min read",
                    "date": "Jun 5, 2026",
                    "title": "5 MVP Mistakes That Kill Startups Before They Launch",
                    "excerpt": "After working with 30+ early-stage startups, we've seen the same fatal mistakes repeat. Here's how to avoid them and ship something people actually want.",
                    "gradient": "from-cyan-500 via-sky-500 to-blue-500",
                    "featured": False
                },
                {
                    "id": str(uuid.uuid4()),
                    "slug": "case-study-synthetix",
                    "category": "Case Study",
                    "tag": "Case Study",
                    "readTime": "10 min read",
                    "date": "May 22, 2026",
                    "title": "Case Study: How We Built Synthetix AI's Core Platform in 12 Weeks",
                    "excerpt": "From blank Figma canvas to production-ready AI platform in 12 weeks. A detailed walkthrough of our architecture decisions, design process, and lessons learned.",
                    "gradient": "from-violet-600 via-purple-600 to-indigo-600",
                    "featured": False
                }
            ]
            for p in default_posts:
                db.add(DBBlogPost(**p))
            print("[SEED] Seeded 6 default blog posts")

        # 6. Stats Seed
        if db.query(DBAgencyStat).count() == 0:
            default_stats = [
                { "id": "stat-1", "label": "Projects Delivered", "value": "150+", "suffix": "", "order_index": 0 },
                { "id": "stat-2", "label": "Client Satisfaction", "value": "98", "suffix": "%", "order_index": 1 },
                { "id": "stat-3", "label": "Years of Excellence", "value": "7", "suffix": "+", "order_index": 2 },
                { "id": "stat-4", "label": "Expert Creatives", "value": "40", "suffix": "+", "order_index": 3 },
            ]
            for s in default_stats:
                db.add(DBAgencyStat(**s))
            print("[SEED] Seeded 4 default stats")

        db.commit()
    except Exception as e:
        print(f"[SEED ERROR] Failed to seed database: {e}")
        db.rollback()
    finally:
        db.close()

# ─── Auth Logic ───────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_admin(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not authorization:
        raise credentials_exception
    try:
        # Expecting 'Bearer <token>'
        token_type, token = authorization.split(" ")
        if token_type.lower() != "bearer":
            raise credentials_exception
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except (JWTError, ValueError):
        raise credentials_exception

    admin = db.query(DBAdminUser).filter_by(username=username).first()
    if admin is None:
        raise credentials_exception
    return admin

# ─── API Auth Routes ──────────────────────────────────────────────────────────

@app.post("/api/auth/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(DBAdminUser).filter_by(username=req.username).first()
    if not admin or not pwd_context.verify(req.password, admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": admin.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me")
def get_me(current_admin: DBAdminUser = Depends(get_current_admin)):
    return {"username": current_admin.username}

# ─── Consultations Routes ──────────────────────────────────────────────────────

class ConsultationRequest(BaseModel):
    category: str
    budget: str
    timeline: str
    description: str
    name: str
    email: str
    whatsapp: Optional[str] = None
    company: Optional[str] = None

@app.post("/api/consultations")
def create_consultation(request: ConsultationRequest, db: Session = Depends(get_db)):
    db_consult = DBConsultation(
        id=uuid.uuid4().hex,
        category=request.category,
        budget=request.budget,
        timeline=request.timeline,
        description=request.description,
        name=request.name,
        email=request.email,
        whatsapp=request.whatsapp,
        company=request.company,
        created_at=datetime.utcnow()
    )
    db.add(db_consult)
    db.commit()
    print(f"\n[LEAD CAPTURED] {request.name} ({request.email}) | WA: {request.whatsapp}")
    return {"status": "success", "message": "Inquiry submitted successfully!"}

@app.get("/api/consultations")
def get_consultations(
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    consultations = db.query(DBConsultation).order_by(DBConsultation.created_at.desc()).all()
    return {"status": "success", "count": len(consultations), "data": consultations}

@app.delete("/api/consultations/{id}")
def delete_consultation(
    id: str,
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    item = db.query(DBConsultation).filter_by(id=id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Consultation request not found")
    db.delete(item)
    db.commit()
    return {"status": "success", "message": "Consultation request deleted"}

# ─── Team Management ──────────────────────────────────────────────────────────

@app.get("/api/team")
def get_team(db: Session = Depends(get_db)):
    members = db.query(DBTeamMember).all()
    # parse comma-separated skills into list
    data = []
    for m in members:
        data.append({
            "id": m.id,
            "name": m.name,
            "role": m.role,
            "bio": m.bio,
            "skills": [s.strip() for s in m.skills.split(",") if s.strip()],
            "photo_url": m.photo_url
        })
    return {"status": "success", "count": len(data), "data": data}

@app.post("/api/team")
async def add_team_member(
    name: Optional[str] = Form(""),
    role: Optional[str] = Form(""),
    bio: Optional[str] = Form(""),
    skills: Optional[str] = Form(""),
    photo: UploadFile = File(...),
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Validate image type
    if photo.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WebP images are accepted.")

    # Save photo with unique filename
    ext = photo.filename.rsplit(".", 1)[-1] if "." in photo.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    contents = await photo.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    member = DBTeamMember(
        id=uuid.uuid4().hex,
        name=name,
        role=role,
        bio=bio,
        skills=skills,
        photo_url=f"http://localhost:8000/uploads/{filename}"
    )
    db.add(member)
    db.commit()
    return {
        "status": "success", 
        "data": {
            "id": member.id,
            "name": member.name,
            "role": member.role,
            "bio": member.bio,
            "skills": [s.strip() for s in member.skills.split(",") if s.strip()],
            "photo_url": member.photo_url
        }
    }

@app.delete("/api/team/{member_id}")
def delete_team_member(
    member_id: str,
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    member = db.query(DBTeamMember).filter_by(id=member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found.")
    db.delete(member)
    db.commit()
    return {"status": "success", "message": "Member removed."}

# ─── Testimonials Management ──────────────────────────────────────────────────

class TestimonialRequest(BaseModel):
    quote: str
    author: str
    role: str
    avatar: str
    gradient: str

@app.get("/api/testimonials")
def get_testimonials(db: Session = Depends(get_db)):
    items = db.query(DBTestimonial).all()
    return {"status": "success", "count": len(items), "data": items}

@app.post("/api/testimonials")
async def add_testimonial(
    quote: str = Form(...),
    author: str = Form(...),
    role: str = Form(...),
    photo: UploadFile = File(...),
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if photo.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WebP images are accepted.")

    ext = photo.filename.rsplit(".", 1)[-1] if "." in photo.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    contents = await photo.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    t = DBTestimonial(
        id=uuid.uuid4().hex,
        quote=quote,
        author=author,
        role=role,
        avatar="",
        gradient="",
        photo_url=f"http://localhost:8000/uploads/{filename}"
    )
    db.add(t)
    db.commit()
    db.refresh(t)
    return {"status": "success", "data": t}

@app.delete("/api/testimonials/{id}")
def delete_testimonial(
    id: str,
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    t = db.query(DBTestimonial).filter_by(id=id).first()
    if not t:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    db.delete(t)
    db.commit()
    return {"status": "success", "message": "Testimonial removed"}

# ─── Portfolio / Project Management ───────────────────────────────────────────

class ProjectRequest(BaseModel):
    title: str
    client: str
    category: str
    gradient: str
    year: str

@app.get("/api/portfolio")
def get_portfolio(db: Session = Depends(get_db)):
    items = db.query(DBProject).all()
    return {"status": "success", "count": len(items), "data": items}

@app.post("/api/portfolio")
async def add_project(
    title: str = Form(...),
    client: str = Form(...),
    category: str = Form(...),
    year: str = Form(...),
    photo: UploadFile = File(...),
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if photo.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WebP images are accepted.")

    ext = photo.filename.rsplit(".", 1)[-1] if "." in photo.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    contents = await photo.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    p = DBProject(
        id=uuid.uuid4().hex,
        title=title,
        client=client,
        category=category,
        gradient="",
        year=year,
        photo_url=f"http://localhost:8000/uploads/{filename}"
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"status": "success", "data": p}

@app.delete("/api/portfolio/{id}")
def delete_project(
    id: str,
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    p = db.query(DBProject).filter_by(id=id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(p)
    db.commit()
    return {"status": "success", "message": "Project removed"}

# ─── Blog Management ──────────────────────────────────────────────────────────

class BlogPostRequest(BaseModel):
    slug: str
    category: str
    tag: str
    readTime: str
    date: str
    title: str
    excerpt: str
    gradient: str
    featured: bool

@app.get("/api/blogs")
def get_blogs(db: Session = Depends(get_db)):
    posts = db.query(DBBlogPost).all()
    return {"status": "success", "count": len(posts), "data": posts}

@app.post("/api/blogs")
async def add_blog_post(
    title: str = Form(...),
    category: str = Form(...),
    readTime: str = Form(...),
    excerpt: str = Form(...),
    featured: bool = Form(False),
    photo: UploadFile = File(...),
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    if photo.content_type not in ("image/jpeg", "image/png", "image/webp"):
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, or WebP images are accepted.")

    ext = photo.filename.rsplit(".", 1)[-1] if "." in photo.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    contents = await photo.read()
    with open(filepath, "wb") as f:
        f.write(contents)

    # Generate slug from title
    import re
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')
    
    existing = db.query(DBBlogPost).filter_by(slug=slug).first()
    if existing:
        slug = f"{slug}-{uuid.uuid4().hex[:4]}"
        
    if featured:
        db.query(DBBlogPost).update({DBBlogPost.featured: False})

    current_date = datetime.now().strftime("%b %d, %Y")

    p = DBBlogPost(
        id=uuid.uuid4().hex,
        slug=slug,
        category=category,
        tag=category,
        readTime=readTime,
        date=current_date,
        title=title,
        excerpt=excerpt,
        gradient="",
        featured=featured,
        photo_url=f"http://localhost:8000/uploads/{filename}"
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"status": "success", "data": p}

@app.delete("/api/blogs/{id}")
def delete_blog_post(
    id: str,
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    p = db.query(DBBlogPost).filter_by(id=id).first()
    if not p:
        raise HTTPException(status_code=404, detail="Blog post not found")
    db.delete(p)
    db.commit()
    return {"status": "success", "message": "Blog post removed"}

# ─── Stats Bar Management ──────────────────────────────────────────────────────

class StatUpdateRequest(BaseModel):
    label: str
    value: str
    suffix: str

@app.get("/api/stats")
def get_stats(db: Session = Depends(get_db)):
    stats = db.query(DBAgencyStat).order_by(DBAgencyStat.order_index.asc()).all()
    return {"status": "success", "data": stats}

@app.put("/api/stats/{id}")
def update_stat(
    id: str,
    req: StatUpdateRequest,
    current_admin: DBAdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    stat = db.query(DBAgencyStat).filter_by(id=id).first()
    if not stat:
        raise HTTPException(status_code=404, detail="Stat not found")
    stat.label = req.label
    stat.value = req.value
    stat.suffix = req.suffix
    db.commit()
    db.refresh(stat)
    return {"status": "success", "data": stat}

# ─── Run Server ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
